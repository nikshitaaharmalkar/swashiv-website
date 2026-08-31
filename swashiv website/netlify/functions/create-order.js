// netlify/functions/create-order.js
// Creates a Razorpay order server-side, so the secret key never touches the browser.
// Requires these environment variables set in Netlify (Site settings > Environment variables):
//   RAZORPAY_KEY_ID
//   RAZORPAY_KEY_SECRET

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!KEY_ID || !KEY_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Payment is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Netlify environment variables.'
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const amountInRupees = Number(body.amount);

    if (!amountInRupees || amountInRupees <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amountInRupees * 100), // paise
        currency: 'INR',
        receipt: 'swashiv_' + Date.now()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: data.error?.description || 'Razorpay order creation failed' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ orderId: data.id, amount: data.amount, currency: data.currency, keyId: KEY_ID })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
