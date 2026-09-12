export default function handler(req, res) {
  // 1. Set CORS headers to allow requests from your GitHub Pages site
  const allowedOrigin = 'https://saalamandras.github.io';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Handle browser CORS preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Only allow POST requests; reject all other HTTP methods
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 4. Extract message from the request body and return the echo response
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" parameter in request body.' });
  }

  return res.status(200).json({
    reply: `you said: ${message}`
  });
}