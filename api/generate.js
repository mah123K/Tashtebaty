// api/generate.js (debug for Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = process.env.GCP_API_KEY;
    if (!apiKey) {
      console.error('DEBUG: Missing GCP_API_KEY in environment');
      return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
    }

    // stringify body safely
    let bodyString;
    try { bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}); }
    catch (e) { bodyString = '[unserializable body]'; }

    const bodySize = Buffer.byteLength(bodyString, 'utf8');
    console.error('DEBUG: env present:', !!apiKey);
    console.error('DEBUG: incoming body size (bytes):', bodySize);

    // If body too big, return helpful message
    // Vercel serverless limit ~4.5MB -> 4.5 * 1024 * 1024 = 4718592 bytes
    if (bodySize > 4_718_592) {
      console.error('DEBUG: body exceeds Vercel function payload limit');
      return res.status(413).json({ error: 'Payload too large for serverless function', size: bodySize });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const upstreamRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyString
    });

    const text = await upstreamRes.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

    console.error('DEBUG: upstream status', upstreamRes.status);
    console.error('DEBUG: upstream body (truncated 2000 chars):', typeof text === 'string' ? text.slice(0,2000) : text);

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({ error: 'Upstream API error', status: upstreamRes.status, details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Unhandled /api/generate error:', err && (err.stack || err));
    return res.status(500).json({ error: 'Internal server error', message: err && err.message });
  }
}
