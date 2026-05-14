/*
  AI Intake Audit Engine
  ----------------------
  Receives intake data, runs AI analysis to:
  1. Score lead quality (0-100)
  2. Extract pain points → map to Aetheris products
  3. Generate requirements document
  4. Recommend tier + customizations
  5. Record everything to Google Sheet + return structured audit

  POST /api/intake-audit
  Body: { name, email, phone, business, industry, location, website, challenges, goals, tier }
*/

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const INTAKE_SHEET_ID = process.env.INTAKE_SHEET_ID;

const BOOKING_LINK = 'https://calendar.app.google/JajCvPZdws3fpAL18';

const PRODUCT_CATALOG = {
  'online_presence': {
    name: 'Aetheris Online Presence',
    signals: ['no website', 'bad website', 'not found on google', 'no online presence', 'need a website', 'website redesign', 'seo', 'google business', 'reviews'],
    tiers: ['Starter', 'Growth', 'Authority']
  },
  'money_magnet': {
    name: 'Money Magnet AI',
    signals: ['no leads', 'lead generation', 'chatbot', 'ai assistant', 'capture leads', 'convert visitors', 'missed calls', 'after hours', 'booking', 'appointments'],
    tiers: ['Core', 'Pro', 'Enterprise']
  },
  'aetheris_scale': {
    name: 'Aetheris Scale',
    signals: ['outreach', 'cold email', 'linkedin', 'grow fast', 'more customers', 'sales pipeline', 'crm', 'follow up'],
    tiers: ['Growth', 'Scale', 'Dominate']
  },
  'aetheris_flow': {
    name: 'Aetheris Flow',
    signals: ['automation', 'waste time', 'manual tasks', 'invoicing', 'scheduling', 'back office', 'admin work', 'repetitive'],
    tiers: ['Lite', 'Business', 'Enterprise']
  },
  'aetheris_build': {
    name: 'Aetheris Build',
    signals: ['custom software', 'app', 'integration', 'api', 'portal', 'dashboard', 'unique needs', 'nothing off the shelf'],
    tiers: ['MVP', 'Growth', 'Platform']
  }
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function base64Url(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function getGoogleAccessToken() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  });
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  if (!r.ok) throw new Error(`Google auth failed: ${r.status}`);
  return (await r.json()).access_token;
}

async function appendAuditToSheet(token, sheetId, row) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Intake%20Audits!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] })
  });
  if (!r.ok) throw new Error(`Sheet append failed: ${r.status}`);
  return r.json();
}

async function sendAuditEmail(token, audit, lead) {
  const to = process.env.INTAKE_NOTIFY_EMAIL || 'fkifle@aetherisinnovations.com';
  const from = process.env.INTAKE_EMAIL_FROM || 'fkifle@aetherisinnovations.com';
  const subject = `[AUDIT] ${lead.business} — Score ${audit.score}/100 — ${audit.recommended_products.join(', ')}`;

  const body = [
    `=== AI INTAKE AUDIT ===`,
    `Lead: ${lead.name} (${lead.email})`,
    `Business: ${lead.business} | Industry: ${lead.industry} | Location: ${lead.location}`,
    ``,
    `SCORE: ${audit.score}/100 (${audit.quality_label})`,
    `CONFIDENCE: ${Math.round(audit.confidence * 100)}%`,
    ``,
    `RECOMMENDED PRODUCTS:`,
    ...audit.recommended_products.map(p => `  • ${p}`),
    ``,
    `RECOMMENDED TIER: ${audit.recommended_tier || 'Custom'}`,
    ``,
    `PAIN POINTS IDENTIFIED:`,
    ...audit.pain_points.map(p => `  • ${p}`),
    ``,
    `REQUIREMENTS:`,
    ...audit.requirements.map(r => `  • ${r}`),
    ``,
    `ESTIMATED SETUP: ${audit.estimated_setup_days} days`,
    `ESTIMATED MONTHLY: ${audit.estimated_monthly}`,
    ``,
    `NEXT ACTION: ${audit.next_action}`,
    `Booking: ${BOOKING_LINK}`,
    ``,
    `---`,
    `Raw challenges: ${lead.challenges || 'N/A'}`,
    `Raw goals: ${lead.goals || 'N/A'}`
  ].join('\n');

  const raw = [`From: Aetheris Audit <${from}>`, `To: ${to}`, `Subject: ${subject}`,
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', '', body].join('\r\n');

  const r = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: base64Url(raw) })
  });
  if (!r.ok) throw new Error(`Email failed: ${r.status}`);
  return r.json();
}

async function runAiAudit(lead) {
  if (!OPENAI_API_KEY) {
    return fallbackAudit(lead);
  }

  const systemPrompt = `You are the Aetheris Innovations AI Intake Auditor. Analyze business intake data and produce a structured audit.

PRODUCT CATALOG:
${JSON.stringify(PRODUCT_CATALOG, null, 2)}

SCORING CRITERIA (0-100):
- 80-100: Hot lead. Clear pain, budget implied, specific goals, good fit for flagship
- 60-79: Warm lead. Some clarity, needs education, good fit for mid-tier
- 40-59: Lukewarm. Vague needs, price-sensitive, needs nurturing
- 0-39: Cold. Unclear, not ready, or poor fit

OUTPUT STRICT JSON:
{
  "score": number,
  "quality_label": "Hot|Warm|Lukewarm|Cold",
  "confidence": number,
  "pain_points": [string],
  "recommended_products": [string],
  "recommended_tier": string,
  "requirements": [string],
  "estimated_setup_days": number,
  "estimated_monthly": string,
  "next_action": string,
  "objections": [string],
  "urgency": "High|Medium|Low"
}`;

  const userPrompt = `Analyze this intake:

Name: ${lead.name}
Business: ${lead.business}
Industry: ${lead.industry}
Location: ${lead.location}
Current Website: ${lead.website || 'None'}
Tier Selected: ${lead.tier || 'None'}
Challenges: ${lead.challenges || 'Not provided'}
Goals: ${lead.goals || 'Not provided'}

Return ONLY valid JSON. No markdown, no explanation.`;

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!r.ok) throw new Error(`OpenAI error: ${r.status}`);
    const data = await r.json();
    const audit = JSON.parse(data.choices[0].message.content);

    // Validate and normalize
    audit.score = Math.min(100, Math.max(0, audit.score || 50));
    audit.confidence = Math.min(1, Math.max(0, audit.confidence || 0.7));
    audit.pain_points = audit.pain_points || [];
    audit.requirements = audit.requirements || [];
    audit.recommended_products = audit.recommended_products || [];
    audit.objections = audit.objections || [];
    audit.estimated_setup_days = audit.estimated_setup_days || 14;
    audit.estimated_monthly = audit.estimated_monthly || 'TBD';
    audit.next_action = audit.next_action || `Schedule strategy call: ${BOOKING_LINK}`;
    audit.urgency = audit.urgency || 'Medium';

    return audit;
  } catch (err) {
    console.error('AI audit failed, using fallback:', err.message);
    return fallbackAudit(lead);
  }
}

function fallbackAudit(lead) {
  const text = `${lead.challenges || ''} ${lead.goals || ''} ${lead.industry || ''}`.toLowerCase();
  const products = [];
  const painPoints = [];

  for (const [key, product] of Object.entries(PRODUCT_CATALOG)) {
    for (const signal of product.signals) {
      if (text.includes(signal)) {
        if (!products.includes(product.name)) products.push(product.name);
        if (!painPoints.includes(signal)) painPoints.push(signal);
        break;
      }
    }
  }

  const hasWebsite = lead.website && lead.website.startsWith('http');
  const hasSpecificGoals = lead.goals && lead.goals.length > 30;
  const hasChallenges = lead.challenges && lead.challenges.length > 20;

  let score = 50;
  if (products.length > 1) score += 15;
  if (hasSpecificGoals) score += 15;
  if (hasChallenges) score += 10;
  if (!hasWebsite) score += 10; // More urgent need
  if (lead.tier === 'Authority') score += 10;

  return {
    score,
    quality_label: score >= 80 ? 'Hot' : score >= 60 ? 'Warm' : score >= 40 ? 'Lukewarm' : 'Cold',
    confidence: 0.6,
    pain_points: painPoints.length ? painPoints : ['Needs discovery'],
    recommended_products: products.length ? products : ['Aetheris Online Presence'],
    recommended_tier: lead.tier || 'Growth',
    requirements: ['Strategy call required for full scoping'],
    estimated_setup_days: lead.tier === 'Authority' ? 14 : lead.tier === 'Growth' ? 10 : 7,
    estimated_monthly: lead.tier === 'Authority' ? '$499/mo' : lead.tier === 'Growth' ? '$199/mo' : '$99/mo',
    next_action: `Schedule strategy call: ${BOOKING_LINK}`,
    objections: [],
    urgency: score >= 70 ? 'High' : score >= 50 ? 'Medium' : 'Low'
  };
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const auditId = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const lead = {
      name: (body.name || '').trim(),
      email: (body.email || '').trim(),
      phone: (body.phone || '').trim(),
      business: (body.business || '').trim(),
      industry: (body.industry || '').trim(),
      location: (body.location || '').trim(),
      website: (body.website || '').trim(),
      challenges: (body.challenges || '').trim(),
      goals: (body.goals || '').trim(),
      tier: (body.tier || '').trim(),
      source: (body.source || 'intake_audit').trim()
    };

    if (!lead.name || !lead.email || !lead.business) {
      return res.status(400).json({ error: 'Missing required fields: name, email, business' });
    }

    // Run AI audit
    const audit = await runAiAudit(lead);

    // Record to sheet
    let sheetUpdated = false;
    try {
      const token = await getGoogleAccessToken();
      const row = [
        auditId,
        new Date().toISOString(),
        lead.source,
        lead.tier,
        lead.name,
        lead.email,
        lead.phone,
        lead.business,
        lead.industry,
        lead.location,
        lead.website,
        audit.score,
        audit.quality_label,
        audit.confidence,
        audit.urgency,
        audit.recommended_products.join(', '),
        audit.recommended_tier,
        audit.estimated_setup_days,
        audit.estimated_monthly,
        audit.pain_points.join('; '),
        audit.requirements.join('; '),
        audit.objections.join('; '),
        audit.next_action,
        'pending_review' // human_review_status
      ];
      await appendAuditToSheet(token, INTAKE_SHEET_ID, row);
      sheetUpdated = true;

      // Send email notification
      try {
        await sendAuditEmail(token, audit, lead);
      } catch (e) {
        console.error('Audit email failed:', e.message);
      }
    } catch (sheetErr) {
      console.error('Sheet recording failed:', sheetErr.message);
    }

    return res.status(200).json({
      ok: true,
      audit_id: auditId,
      audit,
      lead: { name: lead.name, business: lead.business, email: lead.email },
      sheet_updated: sheetUpdated,
      booking_url: BOOKING_LINK,
      review_status: 'pending_review'
    });

  } catch (error) {
    console.error('Intake audit error:', error.message);
    return res.status(500).json({ error: 'Audit failed' });
  }
}
