// netlify/functions/chat.js
// Proxies chat messages to Anthropic's API so the API key never touches the browser.
// Requires this environment variable set in Netlify (Site settings > Environment variables):
//   ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are the friendly shopping assistant for Swashiv Fashion, a small ethnic co-ord set and casual/office wear boutique based in Mapusa, Goa, run by Suvidha Harmalkar.

Facts you can share:
- Products: ethnic co-ord sets, casual & office wear, priced roughly ₹500–₹2,000.
- Orders: taken via the website cart/checkout, or directly via Instagram DM (@swashiv_05) or phone (84088 47963).
- Shipping: ships across India.
- Location: Mapusa, Goa.

Keep replies short, warm, and helpful — like a boutique shop assistant, not a corporate bot. If you don't know something specific (like exact stock of one item), say so honestly and suggest they message @swashiv_05 on Instagram or use the site's contact page to confirm. Never invent product details, prices, or availability you don't actually have.`;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Chat is not configured yet. Add ANTHROPIC_API_KEY in Netlify environment variables.'
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const messages = body.messages || [];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data.error?.message || 'Chat request failed' }) };
    }

    const reply = data.content && data.content[0] ? data.content[0].text : 'Sorry, I could not respond just now.';

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
