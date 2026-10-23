// api/inquiry.js - Vercel Serverless Function
// Handles inquiry submissions: saves to Supabase and dispatches Resend notification emails.


// In-Memory Rate Limiting for Public Inquiries (Mitigates email bombing & quota exhaustion)
const inquiryRateLimits = new Map();
const MAX_INQUIRIES_PER_IP = 5;
const INQUIRY_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkInquiryRateLimit(ip) {
  const now = Date.now();
  const record = inquiryRateLimits.get(ip) || { count: 0, resetAt: now + INQUIRY_WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + INQUIRY_WINDOW_MS;
  }
  if (record.count >= MAX_INQUIRIES_PER_IP) {
    const remainingMins = Math.ceil((record.resetAt - now) / 60000);
    return { allowed: false, remainingMins };
  }
  record.count += 1;
  inquiryRateLimits.set(ip, record);
  return { allowed: true };
}

export default async function handler(req, res) {
  // Restricted CORS Configuration
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
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Requested-With, Accept'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIP = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || '127.0.0.1';
  const rateCheck = checkInquiryRateLimit(clientIP);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: `Too many submissions from this network. Please wait ${rateCheck.remainingMins} minute(s) before submitting again.`
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // use body as is
      }
    }

    const { name, email, inquiry_type, timeline, message, _hp_security_check, hp_check } = body || {};

    // Honeypot spam defense: silent discard to deceive spam bots without leaking heuristics
    if (_hp_security_check || hp_check) {
      return res.status(200).json({
        success: true,
        message: 'Inquiry transmitted and notifications dispatched successfully.',
        dbSaved: true,
        adminNotification: true,
        clientConfirmation: true
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, and message are required.' });
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!EMAIL_REGEX.test(String(email).trim()) || String(email).length > 254) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (String(name).length > 150 || String(message).length > 5000) {
      return res.status(400).json({ error: 'Payload exceeds maximum allowable character length.' });
    }

    // Sanitize CRLF characters to prevent header injection in email subjects
    const safeName = String(name).replace(/[\r\n\t]/g, ' ').trim();
    const safeInquiryType = (inquiry_type ? String(inquiry_type) : 'General Professional Inquiry').replace(/[\r\n\t]/g, ' ').trim();
    const safeEmail = String(email).replace(/[\r\n\t]/g, ' ').trim();

    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hzjzrnliyilimzpymldt.supabase.co';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_NcJDQyR6YNG_A4Klm1B32A_-bOqwDk8';
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const rawAdmin = process.env.RESEND_ADMIN_EMAIL || 'music@jaydymilla.com';
    const adminRecipients = rawAdmin.split(',').map(s => s.trim()).filter(Boolean);
    const adminTo = adminRecipients.length === 1 ? adminRecipients[0] : adminRecipients;
    const primaryAdmin = adminRecipients[0] || 'music@jaydymilla.com';
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'JayDyMilla Licensing Desk <inquiry@jaydymilla.com>';
    const FALLBACK_FROM = 'JayDyMilla <onboarding@resend.dev>';

    // 1. Save to Supabase Inquiries table
    let dbSuccess = false;
    try {
      const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          inquiry_type: inquiry_type || 'General Professional Inquiry',
          timeline: timeline ? timeline.trim() : null,
          message: message.trim()
        })
      });
      dbSuccess = dbResponse.ok;
    } catch (dbErr) {
      console.error('[Supabase Storage Error]:', dbErr);
    }

    // Helper to send email via Resend
    async function sendResendMail(payload, canFallback = true) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'User-Agent': 'Mozilla/5.0 (JayDyMilla-Inquiry/1.0)'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok && canFallback && payload.from !== FALLBACK_FROM) {
          console.warn('[Resend Warning] Retrying with fallback sender:', data);
          return await sendResendMail({ ...payload, from: FALLBACK_FROM }, false);
        }
        return { ok: response.ok, data };
      } catch (err) {
        console.error('[Resend Request Error]:', err);
        return { ok: false, error: err.message };
      }
    }

    // Format Timestamp
    const timestampStr = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // 2. Email to Admin (music@jaydymilla.com)
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050507; color: #f0f0f5; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #0c0c10; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; overflow: hidden; }
          .header { background: #000000; padding: 24px 32px; border-bottom: 2px solid #bbf246; }
          .badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #bbf246; background: rgba(187,242,70,0.12); padding: 4px 10px; border-radius: 4px; margin-bottom: 8px; }
          .title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: -0.02em; }
          .content { padding: 32px; }
          .field-row { margin-bottom: 20px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8a8a9a; margin-bottom: 4px; }
          .value { font-size: 15px; color: #ffffff; font-weight: 500; }
          .message-box { background: #14141a; border-left: 3px solid #bbf246; padding: 18px 20px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #e2e2ec; white-space: pre-wrap; margin-top: 6px; }
          .cta-btn { display: inline-block; background: #bbf246; color: #000000; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; text-decoration: none; padding: 12px 24px; border-radius: 6px; text-transform: uppercase; margin-top: 24px; }
          .footer { padding: 20px 32px; background: #08080b; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #626274; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Inquiry Dispatch</span>
            <h1 class="title">New Professional Inquiry</h1>
          </div>
          <div class="content">
            <div class="field-row">
              <div class="label">Inquirer Name</div>
              <div class="value">${escapeHtml(name)}</div>
            </div>
            <div class="field-row">
              <div class="label">Direct Email</div>
              <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #bbf246; text-decoration: none;">${escapeHtml(email)}</a></div>
            </div>
            <div class="field-row">
              <div class="label">Category / Purpose</div>
              <div class="value" style="color: #bbf246;">${escapeHtml(inquiry_type || 'General')}</div>
            </div>
            ${timeline ? `
            <div class="field-row">
              <div class="label">Project Timeline / Proposed Date</div>
              <div class="value">${escapeHtml(timeline)}</div>
            </div>` : ''}
            <div class="field-row">
              <div class="label">Message & Scope Details</div>
              <div class="message-box">${escapeHtml(message)}</div>
            </div>
            <div>
              <a href="mailto:${escapeHtml(email)}?subject=Re:%20JayDyMilla%20Inquiry%20-%20${encodeURIComponent(inquiry_type || 'Professional')}" class="cta-btn">Reply Direct to ${escapeHtml(name)} ↗</a>
            </div>
          </div>
          <div class="footer">
            Logged to JayDyMilla Database • America/New_York: ${timestampStr}
          </div>
        </div>
      </body>
      </html>
    `;

    // 3. Email to Inquirer / Client (Confirmation)
    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050507; color: #f0f0f5; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #0c0c10; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; overflow: hidden; }
          .header { background: #000000; padding: 28px 32px; border-bottom: 2px solid #bbf246; text-align: center; }
          .brand { font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.1em; text-transform: uppercase; margin: 0; }
          .subtitle { font-size: 11px; color: #bbf246; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 6px; }
          .content { padding: 32px; font-size: 14px; line-height: 1.6; color: #d0d0dc; }
          .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 16px; }
          .card { background: #14141a; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 20px; margin: 24px 0; }
          .card-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #8a8a9a; margin-bottom: 12px; }
          .card-item { margin-bottom: 8px; font-size: 13px; }
          .card-item strong { color: #ffffff; }
          .footer { padding: 24px 32px; background: #08080b; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #626274; text-align: center; line-height: 1.5; }
          .footer a { color: #bbf246; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">JAYDYMILLA</h1>
            <div class="subtitle">Executive &amp; Licensing Desk</div>
          </div>
          <div class="content">
            <div class="greeting">Hello ${escapeHtml(name)},</div>
            <p>
              Your transmission regarding <strong>"${escapeHtml(inquiry_type || 'Professional Inquiry')}"</strong> has been successfully received and routed to JayDyMilla's executive desk.
            </p>
            <p>
              Whether this concerns sync licensing, concert booking, or custom production, our team reviews each inquiry personally. Stems, contract clearances, and schedule availability will be provided promptly.
            </p>
            <div class="card">
              <div class="card-title">Transmission Summary</div>
              <div class="card-item"><strong>Inquirer:</strong> ${escapeHtml(name)}</div>
              <div class="card-item"><strong>Inquiry Category:</strong> ${escapeHtml(inquiry_type || 'General')}</div>
              ${timeline ? `<div class="card-item"><strong>Timeline / Target Date:</strong> ${escapeHtml(timeline)}</div>` : ''}
              <div class="card-item"><strong>Status:</strong> Logged &amp; In Executive Queue</div>
            </div>
            <p style="margin-bottom: 0;">
              Warm regards,<br>
              <strong style="color: #ffffff;">The JayDyMilla Management Team</strong><br>
              <span style="font-size: 12px; color: #8a8a9a;">Asheville, North Carolina</span>
            </p>
          </div>
          <div class="footer">
            Official Portal: <a href="https://jaydymilla.com">jaydymilla.com</a> • Direct Desk: <a href="mailto:music@jaydymilla.com">music@jaydymilla.com</a><br>
            © 2026 JayDyMilla. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // Dispatch Admin Email
    const adminResult = await sendResendMail({
      from: FROM_EMAIL,
      to: adminTo,
      reply_to: safeEmail,
      subject: `⚡ New Inquiry: [${safeInquiryType}] from ${safeName}`,
      html: adminHtml
    });

    // Dispatch Inquirer Confirmation Email
    let clientResult = { ok: false };
    if (safeEmail && safeEmail.includes('@')) {
      clientResult = await sendResendMail({
        from: FROM_EMAIL,
        to: safeEmail,
        reply_to: primaryAdmin,
        subject: `Inquiry Received // JayDyMilla Executive Desk`,
        html: clientHtml
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry transmitted and notifications dispatched successfully.',
      dbSaved: dbSuccess,
      adminNotification: adminResult.ok,
      clientConfirmation: clientResult.ok
    });
  } catch (err) {
    console.error('[Inquiry API Handler Error]:', err);
    return res.status(500).json({
      error: 'An internal error occurred while processing the inquiry.',
      details: err.message
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
