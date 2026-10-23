// api/track.js - Vercel Serverless Function
// High-performance, privacy-friendly visitor geolocation & traffic telemetry tracker

import crypto from 'node:crypto';


// In-Memory Telemetry Rate Throttle (Prevents database exhaustion & hit flooding)
const trackRateLimits = new Map();
const MAX_TRACK_PER_MIN = 30;
const TRACK_WINDOW_MS = 60 * 1000;

function checkTrackThrottle(ip) {
  const now = Date.now();
  const rec = trackRateLimits.get(ip) || { count: 0, resetAt: now + TRACK_WINDOW_MS };
  if (now > rec.resetAt) {
    rec.count = 0;
    rec.resetAt = now + TRACK_WINDOW_MS;
  }
  if (rec.count >= MAX_TRACK_PER_MIN) {
    return false;
  }
  rec.count += 1;
  trackRateLimits.set(ip, rec);
  return true;
}

export default async function handler(req, res) {
  // CORS Configuration
  const origin = req.headers.origin;
  const ALLOWED_ORIGINS = [
    'https://jaydymilla.com',
    'https://www.jaydymilla.com',
    'https://11jaydymilla.vercel.app'
  ];
  const isAllowedOrigin = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  );

  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://jaydymilla.com');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || '127.0.0.1';
  if (!checkTrackThrottle(clientIP)) {
    return res.status(200).json({ success: true, throttled: true });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const { path, referrer, device } = body || {};

    // Don't track admin portal visits to preserve clean visitor metrics
    if (path && path.startsWith('/admin')) {
      return res.status(200).json({ success: true, ignored: true });
    }

    // Geolocation from Vercel Edge Headers
    const country = req.headers['x-vercel-ip-country'] || 'US';
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'New York';
    const region = req.headers['x-vercel-ip-country-region'] || 'NY';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Privacy-preserving unique visitor IP hash
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(clientIP + 'traffic_salt_2026').digest('hex').substring(0, 16);

    // Normalize referrer
    let cleanSource = 'Direct';
    const rawRef = String(referrer || '').toLowerCase();
    if (rawRef.includes('google')) cleanSource = 'Google';
    else if (rawRef.includes('instagram')) cleanSource = 'Instagram';
    else if (rawRef.includes('spotify')) cleanSource = 'Spotify';
    else if (rawRef.includes('youtube')) cleanSource = 'YouTube';
    else if (rawRef.includes('tiktok')) cleanSource = 'TikTok';
    else if (rawRef.includes('t.co') || rawRef.includes('twitter') || rawRef.includes('x.com')) cleanSource = 'X (Twitter)';
    else if (rawRef.includes('facebook') || rawRef.includes('fb.com')) cleanSource = 'Facebook';
    else if (rawRef.includes('linkedin')) cleanSource = 'LinkedIn';
    else if (rawRef && rawRef !== 'direct' && !rawRef.includes('jaydymilla.com') && !rawRef.includes('localhost')) {
      try {
        cleanSource = new URL(rawRef).hostname.replace('www.', '');
      } catch (e) {
        cleanSource = 'Referral';
      }
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hzjzrnliyilimzpymldt.supabase.co';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_NcJDQyR6YNG_A4Klm1B32A_-bOqwDk8';

    // Insert telemetry record into Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/visitor_traffic`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        ip_hash: ipHash,
        country: country.toUpperCase(),
        city: city,
        region: region,
        path: String(path || '/').substring(0, 100),
        referrer: cleanSource,
        device: device === 'Mobile' ? 'Mobile' : 'Desktop',
        user_agent: userAgent.substring(0, 255)
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    // Fail silently without disrupting user browsing experience
    console.error('[Traffic Tracking Exception]:', err);
    return res.status(200).json({ success: false });
  }
}
