const AI_GATEWAY_BASE_URL = 'https://ai-gateway.vercel.sh/v1';
const AI_GATEWAY_MODEL = process.env.AI_GATEWAY_MODEL || 'anthropic/claude-haiku-4.5';

const MEDSPA_CONTEXT = `You are the Money Magnet AI demo assistant for a fictional medspa called Aurora Skin Studio.

Your job is to demonstrate how Aetheris Innovations can turn a medspa website into a lead capture and booking system.

Business context:
- Business: Aurora Skin Studio, a fictional demo medspa used by Aetheris Innovations.
- Services: Botox/injectables, laser hair removal, facials, chemical peels, skin rejuvenation, body contouring consultations.
- Primary CTA: capture the visitor's contact details and route qualified prospects to book a consultation.
- Demo booking link: https://calendar.app.google/JajCvPZdws3fpAL18
- Service area: local appointment-based medspa.

Rules:
- Be transparent that this is a demo AI assistant.
- Do not provide medical diagnosis or personalized treatment advice.
- Do not guarantee outcomes, safety for a specific person, or exact pricing.
- Use approved general pricing language only: consultation pricing and treatment pricing vary by treatment plan; the team can confirm during consultation.
- Ask one qualifying question at a time.
- If the visitor shows buying intent, ask for service interest, timeline, name, email, and phone.
- Keep responses under 90 words.
- End with a next step when appropriate.

Lead qualification guidance:
- Hot: wants consultation soon, names a service, provides contact info.
- Warm: interested but unsure on timing.
- Review: asks medical/safety-specific questions that need a provider.
- Bad fit: asks for unsupported services or medical guarantees.

The demo should make the business value obvious: after-hours visitors get instant answers, qualified leads are captured, and the owner receives a notification.`;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function fallbackReply(message) {
  const text = String(message || '').toLowerCase();
  if (text.includes('botox') || text.includes('inject')) {
    return 'Yes — this demo medspa offers injectables as an example service. I can share general info, but a provider should confirm what is right for you. Are you hoping to book a consultation soon or just comparing options?';
  }
  if (text.includes('price') || text.includes('cost')) {
    return 'Pricing depends on the treatment plan and provider assessment, so I would avoid quoting an exact number in chat. The best next step is a consultation. Which treatment are you most interested in?';
  }
  if (text.includes('book') || text.includes('appointment')) {
    return 'Absolutely. For this demo, the booking CTA routes to the Aetheris calendar: https://calendar.app.google/JajCvPZdws3fpAL18. Before booking, what service are you interested in and when would you like to come in?';
  }
  return 'Thanks for checking out the Money Magnet AI medspa demo. I can answer general service questions, qualify your interest, and help route you to book a consultation. Which treatment are you interested in?';
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history = [] } = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Message is required' });
    if (message.length > 1200) return res.status(400).json({ error: 'Message too long' });
    if (!Array.isArray(history)) return res.status(400).json({ error: 'Invalid history' });

    const gatewayToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if (!gatewayToken) {
      return res.json({ reply: fallbackReply(message), fallback: true });
    }

    const gatewayResponse = await fetch(`${AI_GATEWAY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gatewayToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_GATEWAY_MODEL,
        max_tokens: 260,
        messages: [
          { role: 'system', content: MEDSPA_CONTEXT },
          ...history.slice(-8),
          { role: 'user', content: message }
        ]
      })
    });

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text();
      console.error('Medspa demo AI Gateway error:', gatewayResponse.status, errorText.slice(0, 300));
      return res.json({ reply: fallbackReply(message), fallback: true });
    }

    const completion = await gatewayResponse.json();
    const reply = completion.choices?.[0]?.message?.content || fallbackReply(message);
    return res.json({ reply });
  } catch (error) {
    console.error('Medspa demo chat error:', error);
    return res.status(500).json({ error: 'Failed to process demo chat' });
  }
}
