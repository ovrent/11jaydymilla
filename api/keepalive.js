// api/keepalive.js - Vercel Serverless Function & Cron Job Target
// Pings Supabase REST API to maintain active project status and prevent automatic pausing.

export default async function handler(req, res) {
  // Allow GET, POST, HEAD
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hzjzrnliyilimzpymldt.supabase.co';
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_NcJDQyR6YNG_A4Klm1B32A_-bOqwDk8';

  try {
    const startTime = Date.now();
    const sbResponse = await fetch(`${SUPABASE_URL}/rest/v1/inquiries?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const durationMs = Date.now() - startTime;

    if (!sbResponse.ok) {
      const errText = await sbResponse.text();
      return res.status(502).json({
        success: false,
        error: `Supabase returned HTTP ${sbResponse.status}`,
        details: errText,
        durationMs,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase keep-alive ping successful. Activity registered.',
      durationMs,
      timestamp: new Date().toISOString(),
      project: '11jaydymilla'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal Server Error during keep-alive ping',
      timestamp: new Date().toISOString()
    });
  }
}
