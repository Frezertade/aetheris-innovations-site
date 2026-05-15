const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BOOKING_LINK = 'https://calendar.app.google/JajCvPZdws3fpAL18';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function clean(value, max = 1200) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function yes(value) {
  return String(value || '').toLowerCase() === 'yes' || value === true || value === 'on';
}

function base64Url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function getGoogleAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) throw new Error('Google OAuth env vars are not configured');
  const params = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: 'refresh_token' });
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
  if (!response.ok) throw new Error(`Google token refresh failed: ${response.status}`);
  const data = await response.json();
  if (!data.access_token) throw new Error('Google token response missing access_token');
  return data.access_token;
}

async function appendVirtualAuditToSheet(accessToken, sheetId, row) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Virtual%20Audits!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ values: [row] }) });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${text.slice(0, 180)}`);
  }
  return response.json();
}

function fallbackAudit(lead) {
  const text = `${lead.main_problem} ${lead.current_tools} ${lead.key_people} ${lead.industry}`.toLowerCase();
  const opportunities = [];
  if (/lead|inquir|call|quote|estimate|follow/.test(text)) opportunities.push('Lead capture and follow-up automation');
  if (/schedule|booking|appointment|dispatch/.test(text)) opportunities.push('Scheduling and routing automation');
  if (/question|faq|support|front desk|office/.test(text)) opportunities.push('AI receptionist / customer FAQ handling');
  if (/spreadsheet|manual|admin|paper|repeat/.test(text)) opportunities.push('Back-office workflow automation');
  if (!opportunities.length) opportunities.push('Discovery required to identify the highest-ROI automation path');
  const score = opportunities.length >= 3 ? 86 : opportunities.length === 2 ? 74 : 62;
  return {
    score,
    quality_label: score >= 80 ? 'Hot' : score >= 65 ? 'Warm' : 'Discovery Needed',
    recommended_offer: opportunities.includes('AI receptionist / customer FAQ handling') ? 'Aetheris Chat + Virtual AI Revenue Audit' : 'Virtual AI Revenue Audit + implementation roadmap',
    interview_plan: [
      'Owner/founder: revenue leaks, business goals, budget, approval process',
      'Sales/front desk: response times, FAQs, objections, follow-up process',
      'Operations: fulfillment bottlenecks, scheduling friction, handoffs'
    ],
    key_questions: [
      'Where do leads currently come from and what happens after first contact?',
      'Which customer questions or tasks repeat every week?',
      'What information is missing before a job, appointment, or sale can move forward?',
      'What would save the team the most time if automated?'
    ],
    opportunities,
    risks: ['Needs recorded interview before final recommendation', 'Implementation scope depends on current systems and data access'],
    next_action: `Schedule recorded virtual audit: ${BOOKING_LINK}`,
    approval_status: 'pending_review'
  };
}

async function runAiAudit(lead) {
  if (!OPENAI_API_KEY) return fallbackAudit(lead);
  const system = `You are Aetheris Innovations' Virtual AI Revenue Audit strategist. Score an applicant for a recorded company audit and return strict JSON with: score number 0-100, quality_label, recommended_offer, interview_plan array, key_questions array, opportunities array, risks array, next_action, approval_status. Focus on AI receptionist, lead capture, follow-up automation, ops automation, custom software, and implementation readiness.`;
  const user = `Applicant:\n${JSON.stringify(lead, null, 2)}\nReturn only valid JSON.`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] })
    });
    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json();
    const audit = JSON.parse(data.choices[0].message.content);
    return {
      score: Math.max(0, Math.min(100, Number(audit.score || 60))),
      quality_label: audit.quality_label || 'Warm',
      recommended_offer: audit.recommended_offer || 'Virtual AI Revenue Audit',
      interview_plan: Array.isArray(audit.interview_plan) ? audit.interview_plan : [],
      key_questions: Array.isArray(audit.key_questions) ? audit.key_questions : [],
      opportunities: Array.isArray(audit.opportunities) ? audit.opportunities : [],
      risks: Array.isArray(audit.risks) ? audit.risks : [],
      next_action: audit.next_action || `Schedule recorded virtual audit: ${BOOKING_LINK}`,
      approval_status: audit.approval_status || 'pending_review'
    };
  } catch (error) {
    console.error('Virtual AI audit failed, using fallback:', error.message);
    return fallbackAudit(lead);
  }
}

async function sendOwnerEmail(accessToken, lead, audit, sheetUrl) {
  const to = process.env.INTAKE_NOTIFY_EMAIL || process.env.DEMO_NOTIFY_EMAIL || 'fkifle@aetherisinnovations.com';
  const from = process.env.INTAKE_EMAIL_FROM || process.env.DEMO_EMAIL_FROM || 'fkifle@aetherisinnovations.com';
  const subject = `[VIRTUAL AUDIT] ${lead.company} — ${audit.quality_label} — Score ${audit.score}/100`;
  const body = [
    '=== VIRTUAL AI REVENUE AUDIT REQUEST ===', '',
    `Company: ${lead.company}`,
    `Contact: ${lead.name} <${lead.email}> | ${lead.phone || 'no phone'}`,
    `Industry: ${lead.industry} | Location: ${lead.location} | Team: ${lead.team_size}`,
    `Website: ${lead.website || 'Not provided'}`,
    `Recording consent: ${lead.recording_consent ? 'YES' : 'NO'}`,
    '', 'KEY PEOPLE TO INTERVIEW:', lead.key_people || 'Not provided',
    '', 'MAIN PROBLEM:', lead.main_problem || 'Not provided',
    '', 'CURRENT TOOLS:', lead.current_tools || 'Not provided',
    '', `SCORE: ${audit.score}/100 (${audit.quality_label})`,
    `RECOMMENDED OFFER: ${audit.recommended_offer}`,
    `APPROVAL STATUS: ${audit.approval_status}`,
    '', 'OPPORTUNITIES:', ...audit.opportunities.map(x => `  • ${x}`),
    '', 'INTERVIEW PLAN:', ...audit.interview_plan.map(x => `  • ${x}`),
    '', 'KEY QUESTIONS:', ...audit.key_questions.map(x => `  • ${x}`),
    '', 'RISKS:', ...audit.risks.map(x => `  • ${x}`),
    '', `NEXT ACTION: ${audit.next_action}`,
    `Booking link: ${BOOKING_LINK}`,
    sheetUrl ? `Sheet: ${sheetUrl}` : ''
  ].filter(Boolean).join('\n');
  const raw = [`From: Aetheris Virtual Audit <${from}>`, `To: ${to}`, `Subject: ${subject}`, 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', '', body].join('\r\n');
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw: base64Url(raw) }) });
  if (!response.ok) throw new Error(`Gmail send failed: ${response.status}`);
  return response.json();
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = req.body || {};
    const lead = {
      audit_id: `virtual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      created_at: new Date().toISOString(),
      source: clean(body.source || 'virtual_company_audit_page', 120),
      offer: clean(body.offer || 'Virtual AI Revenue Audit', 120),
      name: clean(body.name, 120),
      email: clean(body.email, 180),
      phone: clean(body.phone, 80),
      company: clean(body.company, 180),
      website: clean(body.website, 240),
      industry: clean(body.industry, 120),
      location: clean(body.location, 160),
      team_size: clean(body.team_size, 80),
      key_people: clean(body.key_people, 1800),
      main_problem: clean(body.main_problem, 2200),
      current_tools: clean(body.current_tools, 1800),
      recording_consent: yes(body.recording_consent)
    };
    if (!lead.name || !lead.email || !lead.company || !lead.industry || !lead.location || !lead.key_people || !lead.main_problem) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (!lead.recording_consent) return res.status(400).json({ error: 'Recording/transcript consent is required.' });

    const sheetId = process.env.INTAKE_SHEET_ID || process.env.DEMO_LEADS_SHEET_ID;
    if (!sheetId) throw new Error('INTAKE_SHEET_ID (or DEMO_LEADS_SHEET_ID) is not configured');
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    const audit = await runAiAudit(lead);
    const accessToken = await getGoogleAccessToken();
    const row = [
      lead.audit_id, lead.created_at, lead.source, lead.offer, lead.name, lead.email, lead.phone, lead.company, lead.website, lead.industry, lead.location, lead.team_size,
      lead.key_people, lead.main_problem, lead.current_tools, lead.recording_consent ? 'yes' : 'no', audit.score, audit.quality_label, audit.recommended_offer,
      audit.opportunities.join('; '), audit.interview_plan.join('; '), audit.key_questions.join('; '), audit.risks.join('; '), audit.next_action, audit.approval_status, 'new'
    ];
    const sheetResult = await appendVirtualAuditToSheet(accessToken, sheetId, row);
    let emailSent = false;
    let emailId = null;
    try {
      const email = await sendOwnerEmail(accessToken, lead, audit, sheetUrl);
      emailSent = true;
      emailId = email.id || null;
    } catch (emailError) {
      console.error('Virtual audit owner notification failed after sheet append:', emailError.message);
    }
    return res.status(200).json({ ok: true, audit_id: lead.audit_id, sheet_updated: true, updated_range: sheetResult.updates?.updatedRange || null, email_sent: emailSent, email_id: emailId, audit, booking_url: BOOKING_LINK });
  } catch (error) {
    console.error('Virtual audit intake error:', error.message);
    return res.status(500).json({ error: 'Failed to capture virtual audit request' });
  }
}
