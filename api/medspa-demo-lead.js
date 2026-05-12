function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function requiredString(value, max = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function getGoogleAccessToken() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth env vars are not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token refresh failed: ${response.status} ${text.slice(0, 160)}`);
  }

  const data = await response.json();
  if (!data.access_token) throw new Error('Google token response missing access_token');
  return data.access_token;
}

function scoreLead(lead) {
  let score = 0;
  if (lead.service_interest) score += 25;
  if (/today|tomorrow|week|soon|month|asap|now/i.test(lead.timeline)) score += 25;
  if (lead.email && lead.phone) score += 25;
  else if (lead.email || lead.phone) score += 15;
  if (lead.name) score += 10;
  if (lead.booking_requested) score += 15;

  const fit = score >= 80 ? 'hot' : score >= 55 ? 'warm' : score >= 25 ? 'review' : 'cold';
  return { score, fit };
}

async function appendToSheet(accessToken, sheetId, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Medspa%20Demo%20Leads!A:P:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: [values] })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${text.slice(0, 160)}`);
  }

  return response.json();
}

async function sendOwnerEmail(accessToken, lead, sheetUrl) {
  const to = process.env.DEMO_NOTIFY_EMAIL || 'fkifle@aetherisinnovations.com';
  const from = process.env.DEMO_EMAIL_FROM || 'fkifle@aetherisinnovations.com';
  const subject = `Money Magnet AI demo lead: ${lead.service_interest || 'Medspa inquiry'} (${lead.fit_status})`;
  const body = [
    `New Money Magnet AI medspa demo lead`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email || 'not provided'}`,
    `Phone: ${lead.phone || 'not provided'}`,
    `Service interest: ${lead.service_interest}`,
    `Timeline: ${lead.timeline || 'not provided'}`,
    `Fit status: ${lead.fit_status}`,
    `Qualification score: ${lead.qualification_score}`,
    `Booking requested: ${lead.booking_requested ? 'yes' : 'no'}`,
    ``,
    `Summary:`,
    lead.conversation_summary,
    ``,
    `Next action: ${lead.next_action}`,
    sheetUrl ? `Lead sheet: ${sheetUrl}` : '',
    ``,
    `This is an automated demo notification from Aetheris Money Magnet AI.`
  ].filter(Boolean).join('\n');

  const raw = [
    `From: Aetheris Demo <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    '',
    body
  ].join('\r\n');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: base64Url(raw) })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gmail send failed: ${response.status} ${text.slice(0, 160)}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const leadId = `medspa-demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();

    const lead = {
      lead_id: leadId,
      created_at: createdAt,
      source: requiredString(body.source || 'medspa_demo_page', 120),
      name: requiredString(body.name, 120),
      email: requiredString(body.email, 180),
      phone: requiredString(body.phone, 80),
      service_interest: requiredString(body.service_interest, 220),
      timeline: requiredString(body.timeline, 180),
      location: requiredString(body.location || 'Demo visitor', 180),
      conversation_summary: requiredString(body.conversation_summary, 1000),
      booking_requested: Boolean(body.booking_requested)
    };

    if (!lead.name || (!lead.email && !lead.phone) || !lead.service_interest) {
      return res.status(400).json({
        error: 'Missing required lead details: name, service interest, and email or phone are required.'
      });
    }

    const scored = scoreLead(lead);
    lead.qualification_score = scored.score;
    lead.fit_status = scored.fit;
    lead.owner_status = 'new';
    lead.next_action = lead.booking_requested
      ? 'Confirm the consultation request and follow up within 5 minutes.'
      : 'Follow up and offer the consultation booking link.';
    lead.notes = 'Captured from public Aetheris Money Magnet AI medspa demo.';

    const sheetId = process.env.DEMO_LEADS_SHEET_ID;
    const sheetUrl = sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit` : '';
    if (!sheetId) throw new Error('DEMO_LEADS_SHEET_ID is not configured');

    const accessToken = await getGoogleAccessToken();
    const row = [
      lead.lead_id,
      lead.created_at,
      lead.source,
      lead.name,
      lead.email,
      lead.phone,
      lead.service_interest,
      lead.timeline,
      lead.location,
      lead.fit_status,
      lead.qualification_score,
      lead.conversation_summary,
      lead.booking_requested ? 'yes' : 'no',
      lead.owner_status,
      lead.next_action,
      lead.notes
    ];

    const sheetResult = await appendToSheet(accessToken, sheetId, row);
    let emailSent = false;
    let emailId = null;

    try {
      const emailResult = await sendOwnerEmail(accessToken, lead, sheetUrl);
      emailSent = true;
      emailId = emailResult.id || null;
    } catch (emailError) {
      console.error('Owner notification failed after lead was logged:', emailError.message);
    }

    return res.status(200).json({
      ok: true,
      lead_id: lead.lead_id,
      fit_status: lead.fit_status,
      qualification_score: lead.qualification_score,
      sheet_updated: true,
      updated_range: sheetResult.updates?.updatedRange || null,
      email_sent: emailSent,
      email_id: emailId,
      booking_url: 'https://calendar.app.google/JajCvPZdws3fpAL18',
      next_action: lead.next_action
    });
  } catch (error) {
    console.error('Medspa demo lead error:', error.message);
    return res.status(500).json({ error: 'Failed to capture demo lead' });
  }
}
