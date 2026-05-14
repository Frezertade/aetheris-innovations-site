/*
  Human Review Dashboard API
  --------------------------
  GET  /api/human-review — list all pending audits + pipeline stages awaiting review
  POST /api/human-review — submit human decision (approve/reject/comment)

  Body: {
    audit_id: string,
    decision: 'approve' | 'reject' | 'comment',
    notes: string,
    adjusted_products: [string],
    adjusted_tier: string,
    adjusted_price: string
  }
*/

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const INTAKE_SHEET_ID = process.env.INTAKE_SHEET_ID;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

async function getSheetData(token, sheetId, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`Sheet read failed: ${r.status}`);
  return r.json();
}

async function updateSheetRow(token, sheetId, range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
  const r = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [values] })
  });
  if (!r.ok) throw new Error(`Sheet update failed: ${r.status}`);
  return r.json();
}

function parseAudits(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  const data = rows.slice(1);

  return data.map((row, idx) => ({
    row_index: idx + 2, // 1-based, header is row 1
    audit_id: row[0] || '',
    timestamp: row[1] || '',
    source: row[2] || '',
    tier: row[3] || '',
    name: row[4] || '',
    email: row[5] || '',
    phone: row[6] || '',
    business: row[7] || '',
    industry: row[8] || '',
    location: row[9] || '',
    website: row[10] || '',
    score: row[11] || '',
    quality_label: row[12] || '',
    confidence: row[13] || '',
    urgency: row[14] || '',
    recommended_products: row[15] || '',
    recommended_tier: row[16] || '',
    estimated_setup_days: row[17] || '',
    estimated_monthly: row[18] || '',
    pain_points: row[19] || '',
    requirements: row[20] || '',
    objections: row[21] || '',
    next_action: row[22] || '',
    review_status: row[23] || 'pending_review'
  }));
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const token = await getGoogleAccessToken();

    if (req.method === 'GET') {
      const { status = 'pending_review', limit = '20' } = req.query || {};

      // Read Intake Audits sheet
      const auditData = await getSheetData(token, INTAKE_SHEET_ID, 'Intake%20Audits!A:Z');
      const allAudits = parseAudits(auditData.values);

      let filtered = allAudits;
      if (status !== 'all') {
        filtered = allAudits.filter(a => a.review_status === status);
      }
      filtered = filtered.slice(0, parseInt(limit));

      // Read Delivery Pipeline sheet for active projects
      let pipelineProjects = [];
      try {
        const pipeData = await getSheetData(token, INTAKE_SHEET_ID, 'Delivery%20Pipeline!A:Z');
        if (pipeData.values && pipeData.values.length > 1) {
          const pHeaders = pipeData.values[0];
          pipelineProjects = pipeData.values.slice(1).map(row => ({
            project_id: row[0] || '',
            timestamp: row[1] || '',
            stage: row[2] || '',
            status: row[3] || '',
            notes: row[4] || ''
          })).filter(p => p.status === 'pending' || p.status === 'rejected');
        }
      } catch (e) {
        console.error('Pipeline read failed:', e.message);
      }

      return res.status(200).json({
        ok: true,
        audits: filtered,
        pipeline_projects: pipelineProjects,
        counts: {
          pending: allAudits.filter(a => a.review_status === 'pending_review').length,
          approved: allAudits.filter(a => a.review_status === 'approved').length,
          rejected: allAudits.filter(a => a.review_status === 'rejected').length,
          total: allAudits.length
        }
      });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const { audit_id, decision, notes, adjusted_products, adjusted_tier, adjusted_price } = body;

      if (!audit_id || !decision) {
        return res.status(400).json({ error: 'audit_id and decision required' });
      }

      // Find the audit row
      const auditData = await getSheetData(token, INTAKE_SHEET_ID, 'Intake%20Audits!A:Z');
      const allAudits = parseAudits(auditData.values);
      const audit = allAudits.find(a => a.audit_id === audit_id);

      if (!audit) {
        return res.status(404).json({ error: 'Audit not found' });
      }

      const newStatus = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'commented';
      const reviewNotes = [
        `Human review: ${decision}`,
        notes || '',
        adjusted_products ? `Products: ${adjusted_products.join(', ')}` : '',
        adjusted_tier ? `Tier: ${adjusted_tier}` : '',
        adjusted_price ? `Price: ${adjusted_price}` : ''
      ].filter(Boolean).join(' | ');

      // Update the review_status column (X = column 24)
      await updateSheetRow(token, INTAKE_SHEET_ID, `Intake Audits!X${audit.row_index}`, [newStatus]);
      // Update notes column if we had one — for now, we'll append to next_action
      await updateSheetRow(token, INTAKE_SHEET_ID, `Intake Audits!W${audit.row_index}`, [audit.next_action + ' | REVIEW: ' + reviewNotes]);

      // If approved, auto-start delivery pipeline
      let pipelineStarted = false;
      if (decision === 'approve') {
        try {
          const pipelineRes = await fetch(`${req.headers.origin || 'https://aetherisinnovations.com'}/api/delivery-pipeline`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'start',
              project_id: `proj-${audit.audit_id}`,
              intake_audit_id: audit.audit_id,
              specs: {
                business: audit.business,
                industry: audit.industry,
                tier: adjusted_tier || audit.recommended_tier,
                products: adjusted_products || audit.recommended_products.split(', '),
                pain_points: audit.pain_points,
                requirements: audit.requirements
              }
            })
          });
          pipelineStarted = pipelineRes.ok;
        } catch (e) {
          console.error('Auto-pipeline start failed:', e.message);
        }
      }

      return res.status(200).json({
        ok: true,
        audit_id,
        decision,
        new_status: newStatus,
        pipeline_started: pipelineStarted,
        review_notes: reviewNotes
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Human review error:', error.message);
    return res.status(500).json({ error: 'Review system failed', details: error.message });
  }
}
