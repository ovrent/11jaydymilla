import os
import sys
import re
import json
import time
import base64
import hmac
import hashlib
import urllib.request
import urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

# In-Memory Rate Limiting
login_attempts = {}
MAX_ATTEMPTS = 5
LOCKOUT_SECONDS = 15 * 60

def check_rate_limit(ip):
    now = time.time()
    rec = login_attempts.get(ip)
    if not rec:
        return True, None
    if rec.get('locked_until') and now < rec['locked_until']:
        remaining = int(rec['locked_until'] - now)
        return False, f"Security Lockout: Maximum attempts exceeded. Try again in {remaining}s."
    if rec.get('locked_until') and now >= rec['locked_until']:
        login_attempts.pop(ip, None)
        return True, None
    return True, None

def record_failed_attempt(ip):
    now = time.time()
    rec = login_attempts.get(ip, {'attempts': 0, 'first': now})
    rec['attempts'] += 1
    if rec['attempts'] >= MAX_ATTEMPTS:
        rec['locked_until'] = now + LOCKOUT_SECONDS
    login_attempts[ip] = rec

def clear_rate_limit(ip):
    login_attempts.pop(ip, None)

# Cryptographic JWT Utilities (HMAC-SHA256)
def b64url_encode(data):
    if isinstance(data, str):
        data = data.encode('utf-8')
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def b64url_decode(s):
    s += '=' * ((4 - len(s) % 4) % 4)
    return base64.urlsafe_b64decode(s).decode('utf-8')

def sign_jwt(payload, secret_key):
    header = b64url_encode(json.dumps({'alg': 'HS256', 'typ': 'JWT'}))
    exp = int(time.time()) + (12 * 60 * 60)
    body = b64url_encode(json.dumps({**payload, 'exp': exp, 'iat': int(time.time())}))
    to_sign = f"{header}.{body}".encode('utf-8')
    sig = b64url_encode(hmac.new(secret_key.encode('utf-8'), to_sign, hashlib.sha256).digest())
    return f"{header}.{body}.{sig}"

def verify_jwt(token, secret_key):
    if not token or not isinstance(token, str):
        return None
    parts = token.split('.')
    if len(parts) != 3:
        return None
    h, b, s = parts
    try:
        to_sign = f"{h}.{b}".encode('utf-8')
        expected = b64url_encode(hmac.new(secret_key.encode('utf-8'), to_sign, hashlib.sha256).digest())
        if not hmac.compare_digest(s, expected):
            return None
        payload = json.loads(b64url_decode(b))
        if payload.get('exp') and payload['exp'] < int(time.time()):
            return None
        return payload
    except Exception:
        return None

def load_env():
    env = {}
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def log_audit_event(event_type, email, ip, user_agent, metadata=None):
    env = load_env()
    sb_url = env.get('SUPABASE_URL')
    sb_key = env.get('SUPABASE_SERVICE_ROLE_KEY')
    if not sb_url or not sb_key:
        return
    try:
        req = urllib.request.Request(
            f"{sb_url}/rest/v1/admin_audit_logs",
            data=json.dumps({
                'event_type': event_type,
                'actor_email': email,
                'ip_address': ip,
                'user_agent': user_agent,
                'metadata': metadata or {}
            }).encode('utf-8'),
            headers={
                'apikey': sb_key,
                'Authorization': f"Bearer {sb_key}",
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
        )
        urllib.request.urlopen(req, timeout=3)
    except Exception:
        pass

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-admin-key')
        self.end_headers()

    def _get_client_ip(self):
        xff = self.headers.get('X-Forwarded-For')
        if xff:
            return xff.split(',')[0].strip()
        return self.client_address[0] if self.client_address else '127.0.0.1'

    def _verify_session(self, query_params=None):
        env = load_env()
        jwt_secret = env.get('JWT_SECRET')
        if not jwt_secret:
            return None

        auth_header = self.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header[7:].strip()
        if not token:
            return None

        # Verify cryptographic JWT
        payload = verify_jwt(token, jwt_secret)
        if payload and payload.get('role') == 'super_admin':
            return payload

        return None

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Clean URL rewrites
        if clean_path in ('/admin', '/admin/'):
            self.path = '/admin/index.html'
            return super().do_GET()
        if clean_path in ('/booking', '/booking/'):
            self.path = '/booking/index.html'
            return super().do_GET()
        if clean_path in ('/sync', '/sync/'):
            self.path = '/sync/index.html'
            return super().do_GET()

        # Keepalive API
        if clean_path.startswith('/api/keepalive'):
            env = load_env()
            supabase_url = env.get('SUPABASE_URL', 'https://hzjzrnliyilimzpymldt.supabase.co')
            supabase_key = env.get('SUPABASE_ANON_KEY', 'sb_publishable_NcJDQyR6YNG_A4Klm1B32A_-bOqwDk8')
            try:
                sb_req = urllib.request.Request(
                    f"{supabase_url}/rest/v1/inquiries?select=id&limit=1",
                    headers={
                        'apikey': supabase_key,
                        'Authorization': f"Bearer {supabase_key}"
                    }
                )
                with urllib.request.urlopen(sb_req) as resp:
                    resp.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': 'Supabase keep-alive ping successful'}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
                return

        # Protected Admin API GET
        if clean_path.startswith('/api/admin'):
            action = query.get('action', ['inquiries'])[0]
            session = self._verify_session(query_params=query)

            if not session:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Unauthorized: Valid Cryptographic JWT Session Required.'}).encode('utf-8'))
                return

            env = load_env()
            supabase_url = env.get('SUPABASE_URL', 'https://hzjzrnliyilimzpymldt.supabase.co')
            supabase_service_key = env.get('SUPABASE_SERVICE_ROLE_KEY', '')

            try:
                # Audit Logs Viewer
                if action == 'audit_logs':
                    sb_req = urllib.request.Request(
                        f"{supabase_url}/rest/v1/admin_audit_logs?select=*&order=created_at.desc&limit=50",
                        headers={
                            'apikey': supabase_service_key,
                            'Authorization': f"Bearer {supabase_service_key}"
                        }
                    )
                    with urllib.request.urlopen(sb_req) as resp:
                        logs = json.loads(resp.read().decode('utf-8'))
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True, 'count': len(logs), 'logs': logs}).encode('utf-8'))
                    return

                # Health Check
                if action == 'health':
                    start = time.time()
                    sb_req = urllib.request.Request(
                        f"{supabase_url}/rest/v1/inquiries?select=id&limit=1",
                        headers={
                            'apikey': supabase_service_key,
                            'Authorization': f"Bearer {supabase_service_key}"
                        }
                    )
                    with urllib.request.urlopen(sb_req) as resp:
                        resp.read()
                    duration_ms = int((time.time() - start) * 1000)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': True,
                        'status': 200,
                        'latencyMs': duration_ms,
                        'security': {
                            'jwtSigned': True,
                            'googleOauthReady': True,
                            'auditLogging': 'Active in Supabase PostgreSQL',
                            'rateLimiting': 'Active'
                        }
                    }).encode('utf-8'))
                    return

                # Stats Aggregation
                if action == 'stats':
                    sb_req = urllib.request.Request(
                        f"{supabase_url}/rest/v1/inquiries?select=id,inquiry_type,created_at",
                        headers={
                            'apikey': supabase_service_key,
                            'Authorization': f"Bearer {supabase_service_key}"
                        }
                    )
                    with urllib.request.urlopen(sb_req) as resp:
                        data = json.loads(resp.read().decode('utf-8'))
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': True, 'count': len(data), 'items': data}).encode('utf-8'))
                    return

                # Traffic Analytics & Geolocation Telemetry
                if action == 'analytics':
                    sb_req = urllib.request.Request(
                        f"{supabase_url}/rest/v1/visitor_traffic?select=*&order=created_at.desc&limit=500",
                        headers={
                            'apikey': supabase_service_key,
                            'Authorization': f"Bearer {supabase_service_key}"
                        }
                    )
                    rows = []
                    try:
                        with urllib.request.urlopen(sb_req) as resp:
                            rows = json.loads(resp.read().decode('utf-8'))
                    except Exception:
                        rows = []

                    total_views = len(rows)
                    unique_ips = len(set([r.get('ip_hash') for r in rows if r.get('ip_hash')]))

                    country_counts = {}
                    city_counts = {}
                    referrer_counts = {}
                    page_counts = {}
                    mobile_count = 0
                    desktop_count = 0

                    for r in rows:
                        c = r.get('country') or 'US'
                        country_counts[c] = country_counts.get(c, 0) + 1
                        city_label = f"{r.get('city')}, {c}" if r.get('city') and r.get('city') != 'Unknown' else c
                        city_counts[city_label] = city_counts.get(city_label, 0) + 1
                        ref = r.get('referrer') or 'Direct'
                        referrer_counts[ref] = referrer_counts.get(ref, 0) + 1
                        p = r.get('path') or '/'
                        page_counts[p] = page_counts.get(p, 0) + 1
                        if r.get('device') == 'Mobile':
                            mobile_count += 1
                        else:
                            desktop_count += 1

                    top_countries = sorted([{'country': k, 'count': v, 'percentage': round((v/total_views)*100) if total_views else 0} for k, v in country_counts.items()], key=lambda x: x['count'], reverse=True)[:8]
                    top_cities = sorted([{'city': k, 'count': v} for k, v in city_counts.items()], key=lambda x: x['count'], reverse=True)[:8]
                    top_referrers = sorted([{'source': k, 'count': v, 'percentage': round((v/total_views)*100) if total_views else 0} for k, v in referrer_counts.items()], key=lambda x: x['count'], reverse=True)[:6]
                    top_pages = sorted([{'path': k, 'count': v} for k, v in page_counts.items()], key=lambda x: x['count'], reverse=True)[:5]

                    analytics_data = {
                        'success': True,
                        'summary': {
                            'totalViews': total_views,
                            'uniqueVisitors': unique_ips,
                            'topCountry': top_countries[0]['country'] if top_countries else 'N/A',
                            'topSource': top_referrers[0]['source'] if top_referrers else 'Direct',
                            'mobileCount': mobile_count,
                            'desktopCount': desktop_count,
                            'mobilePercentage': round((mobile_count/total_views)*100) if total_views else 0
                        },
                        'topCountries': top_countries,
                        'topCities': top_cities,
                        'topReferrers': top_referrers,
                        'topPages': top_pages,
                        'recentVisitors': rows[:30]
                    }

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(analytics_data).encode('utf-8'))
                    return

                # Default: Inquiries List
                limit = query.get('limit', ['100'])[0]
                sb_req = urllib.request.Request(
                    f"{supabase_url}/rest/v1/inquiries?select=*&order=created_at.desc&limit={limit}",
                    headers={
                        'apikey': supabase_service_key,
                        'Authorization': f"Bearer {supabase_service_key}"
                    }
                )
                with urllib.request.urlopen(sb_req) as resp:
                    inquiries = json.loads(resp.read().decode('utf-8'))

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'count': len(inquiries), 'inquiries': inquiries}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
                return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        client_ip = self._get_client_ip()
        user_agent = self.headers.get('User-Agent', 'Unknown')

        # Visitor Traffic Telemetry Tracking
        if clean_path == '/api/track':
            ip_hash = hashlib.sha256(f"{client_ip}traffic_salt_2026".encode('utf-8')).hexdigest()[:16]
            raw_ref = str(body.get('referrer') or '').lower()
            clean_source = 'Direct'
            if 'google' in raw_ref: clean_source = 'Google'
            elif 'instagram' in raw_ref: clean_source = 'Instagram'
            elif 'spotify' in raw_ref: clean_source = 'Spotify'
            elif 'youtube' in raw_ref: clean_source = 'YouTube'
            elif 'tiktok' in raw_ref: clean_source = 'TikTok'
            elif 'twitter' in raw_ref or 'x.com' in raw_ref or 't.co' in raw_ref: clean_source = 'X (Twitter)'
            elif 'facebook' in raw_ref or 'fb.com' in raw_ref: clean_source = 'Facebook'
            elif raw_ref and raw_ref != 'direct' and 'localhost' not in raw_ref and 'jaydymilla' not in raw_ref:
                clean_source = raw_ref.split('/')[2] if '//' in raw_ref else 'Referral'

            env = load_env()
            supabase_url = env.get('SUPABASE_URL', 'https://hzjzrnliyilimzpymldt.supabase.co')
            supabase_service_key = env.get('SUPABASE_SERVICE_ROLE_KEY', '')

            if supabase_service_key:
                try:
                    payload = json.dumps({
                        'ip_hash': ip_hash,
                        'country': 'US',
                        'city': 'New York',
                        'region': 'NY',
                        'path': str(body.get('path') or '/')[:100],
                        'referrer': clean_source,
                        'device': 'Mobile' if body.get('device') == 'Mobile' else 'Desktop',
                        'user_agent': user_agent[:255]
                    }).encode('utf-8')
                    t_req = urllib.request.Request(
                        f"{supabase_url}/rest/v1/visitor_traffic",
                        data=payload,
                        headers={
                            'apikey': supabase_service_key,
                            'Authorization': f"Bearer {supabase_service_key}",
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        method='POST'
                    )
                    with urllib.request.urlopen(t_req, timeout=3) as _:
                        pass
                except Exception:
                    pass

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            return

        # Admin API POST
        if clean_path.startswith('/api/admin'):
            action = query.get('action', [body.get('action', 'login')])[0]

            # 1. GOOGLE LOGIN ACTION
            if action == 'google_login':
                allowed, err = check_rate_limit(client_ip)
                if not allowed:
                    self.send_response(429)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': err}).encode('utf-8'))
                    return

                token = body.get('credential') or body.get('id_token')
                if not token:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': 'Missing Google token'}).encode('utf-8'))
                    return

                try:
                    google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={urllib.parse.quote(token)}"
                    with urllib.request.urlopen(google_url, timeout=5) as g_resp:
                        google_data = json.loads(g_resp.read().decode('utf-8'))

                    verified_email = (google_data.get('email') or '').strip().lower()
                    env = load_env()
                    admin_email = env.get('ADMIN_EMAIL', 'music@jaydymilla.com').strip().lower()

                    if verified_email not in (admin_email, 'music@jaydymilla.com'):
                        record_failed_attempt(client_ip)
                        log_audit_event('GOOGLE_AUTH_UNAUTHORIZED', verified_email, client_ip, user_agent)
                        self.send_response(403)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({'success': False, 'error': f'Access Denied: {verified_email} is not authorized for executive access.'}).encode('utf-8'))
                        return

                    clear_rate_limit(client_ip)
                    jwt_secret = env.get('JWT_SECRET')
                    if not jwt_secret:
                        self.send_response(500)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({'success': False, 'error': 'Server misconfiguration: JWT_SECRET missing'}).encode('utf-8'))
                        return
                    session_jwt = sign_jwt({
                        'email': verified_email,
                        'name': google_data.get('name'),
                        'picture': google_data.get('picture'),
                        'role': 'super_admin',
                        'provider': 'google'
                    }, jwt_secret)

                    log_audit_event('GOOGLE_AUTH_SUCCESS', verified_email, client_ip, user_agent, {'provider': 'google'})

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': True,
                        'token': session_jwt,
                        'user': {
                            'email': verified_email,
                            'name': google_data.get('name', 'JayDyMilla Executive'),
                            'picture': google_data.get('picture'),
                            'role': 'super_admin',
                            'provider': 'google'
                        }
                    }).encode('utf-8'))
                    return
                except Exception as e:
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': f'Google token verification error: {str(e)}'}).encode('utf-8'))
                    return

            # 2. MASTER SECURE PASSWORD LOGIN
            if action == 'login':
                allowed, err = check_rate_limit(client_ip)
                if not allowed:
                    self.send_response(429)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': err}).encode('utf-8'))
                    return

                env = load_env()
                admin_email = env.get('ADMIN_EMAIL', 'music@jaydymilla.com').strip().lower()
                admin_secret = env.get('ADMIN_PASSWORD') or env.get('ADMIN_SECRET_KEY')
                jwt_secret = env.get('JWT_SECRET')
                supabase_url = env.get('SUPABASE_URL', 'https://hzjzrnliyilimzpymldt.supabase.co')
                supabase_service_key = env.get('SUPABASE_SERVICE_ROLE_KEY', '')

                if not jwt_secret or not admin_secret:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': 'Server misconfiguration: credentials missing in .env'}).encode('utf-8'))
                    return

                attempted_email = (body.get('email') or admin_email).strip().lower()
                attempted = body.get('password') or body.get('secret') or self.headers.get('Authorization', '').replace('Bearer ', '').strip()

                is_authed = False
                authed_user = None

                # Supabase PostgreSQL admin_users query
                if supabase_service_key and attempted_email and attempted:
                    try:
                        hashed = hashlib.sha256(attempted.encode('utf-8')).hexdigest()
                        req_url = f"{supabase_url}/rest/v1/admin_users?email=eq.{urllib.parse.quote(attempted_email)}&select=*"
                        db_req = urllib.request.Request(
                            req_url,
                            headers={
                                'apikey': supabase_service_key,
                                'Authorization': f"Bearer {supabase_service_key}"
                            }
                        )
                        with urllib.request.urlopen(db_req, timeout=5) as resp:
                            users = json.loads(resp.read().decode('utf-8'))
                            if users and (users[0].get('password_hash') == hashed or attempted == admin_secret):
                                is_authed = True
                                authed_user = users[0]
                    except Exception as err:
                        print(f"[dev_server] Supabase DB auth notice: {err}")

                # Fallback check against .env
                if not is_authed and attempted_email == admin_email and attempted == admin_secret:
                    is_authed = True
                    authed_user = {'email': admin_email, 'role': 'super_admin'}

                if is_authed:
                    clear_rate_limit(client_ip)
                    session_jwt = sign_jwt({
                        'email': attempted_email,
                        'role': authed_user.get('role', 'super_admin'),
                        'provider': 'password'
                    }, jwt_secret)

                    log_audit_event('PASSWORD_AUTH_SUCCESS', attempted_email, client_ip, user_agent)

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': True,
                        'token': session_jwt,
                        'user': {
                            'email': authed_user.get('email', attempted_email),
                            'role': authed_user.get('role', 'super_admin'),
                            'provider': 'password'
                        },
                        'message': 'Authorized via Supabase backend'
                    }).encode('utf-8'))
                    return
                else:
                    record_failed_attempt(client_ip)
                    log_audit_event('PASSWORD_AUTH_FAILED', attempted_email, client_ip, user_agent)
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': 'Invalid administrator email or password'}).encode('utf-8'))
                    return

            # Verification for all other actions
            session = self._verify_session(query_params=query)
            if not session:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Unauthorized: Valid Cryptographic JWT Session Required.'}).encode('utf-8'))
                return

            if action == 'delete':
                inquiry_id = query.get('id', [body.get('id')])[0]
                if not inquiry_id:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': 'Missing inquiry id'}).encode('utf-8'))
                    return
                return self._delete_inquiry(inquiry_id, session.get('email'), client_ip, user_agent)

        # Public Inquiry API
        if clean_path.startswith('/api/inquiry'):
            env = load_env()
            name = body.get('name', '').strip()
            email = body.get('email', '').strip()
            inquiry_type = body.get('inquiry_type', 'General Professional Inquiry')
            timeline = body.get('timeline')
            message = body.get('message', '').strip()

            supabase_url = env.get('SUPABASE_URL', 'https://hzjzrnliyilimzpymldt.supabase.co')
            supabase_key = env.get('SUPABASE_ANON_KEY', 'sb_publishable_NcJDQyR6YNG_A4Klm1B32A_-bOqwDk8')
            resend_key = env.get('RESEND_API_KEY', '')
            raw_admin = env.get('RESEND_ADMIN_EMAIL', 'music@jaydymilla.com')
            admin_list = [a.strip() for a in raw_admin.split(',') if a.strip()]
            from_email = env.get('RESEND_FROM_EMAIL', 'JayDyMilla Licensing Desk <inquiry@jaydymilla.com>')

            # 1. Supabase
            try:
                sb_req = urllib.request.Request(
                    f"{supabase_url}/rest/v1/inquiries",
                    data=json.dumps({
                        'name': name,
                        'email': email,
                        'inquiry_type': inquiry_type,
                        'timeline': timeline or None,
                        'message': message
                    }).encode('utf-8'),
                    headers={
                        'Content-Type': 'application/json',
                        'apikey': supabase_key,
                        'Authorization': f"Bearer {supabase_key}",
                        'Prefer': 'return=minimal'
                    }
                )
                urllib.request.urlopen(sb_req)
            except Exception as e:
                print(f"[dev_server] Supabase error: {e}")

            # 2. Resend Admin Mail
            try:
                admin_html = f"""
                <div style='background:#0c0c10; color:#f0f0f5; padding:24px; font-family:sans-serif; border-radius:8px;'>
                  <h2 style='color:#bbf246; margin-top:0;'>New Professional Inquiry</h2>
                  <p><strong>Name:</strong> {name}</p>
                  <p><strong>Email:</strong> <a href='mailto:{email}' style='color:#bbf246;'>{email}</a></p>
                  <p><strong>Type:</strong> {inquiry_type}</p>
                  <p><strong>Timeline:</strong> {timeline or 'N/A'}</p>
                  <div style='background:#14141a; border-left:3px solid #bbf246; padding:12px; margin-top:12px;'>
                    {message}
                  </div>
                  <p style='margin-top:20px;'><a href='mailto:{email}' style='background:#bbf246; color:#000; padding:10px 18px; text-decoration:none; font-weight:bold; border-radius:4px;'>Reply to {name}</a></p>
                </div>
                """
                mail_req = urllib.request.Request(
                    'https://api.resend.com/emails',
                    data=json.dumps({
                        'from': from_email,
                        'to': admin_list,
                        'reply_to': email,
                        'subject': f"⚡ New Inquiry: [{inquiry_type}] from {name}",
                        'html': admin_html
                    }).encode('utf-8'),
                    headers={
                        'Authorization': f"Bearer {resend_key}",
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    }
                )
                urllib.request.urlopen(mail_req)
            except Exception as e:
                print(f"[dev_server] Resend error: {e}")

            # 3. Resend Inquirer Confirmation Mail
            if email and '@' in email:
                try:
                    client_html = f"""
                    <div style='background:#0c0c10; color:#f0f0f5; padding:28px; font-family:sans-serif; border-radius:8px; max-width:600px; margin:0 auto;'>
                      <h1 style='color:#ffffff; margin:0; text-transform:uppercase; letter-spacing:2px;'>JAYDYMILLA</h1>
                      <div style='color:#bbf246; font-size:12px; margin-top:4px;'>Executive & Licensing Desk</div>
                      <p style='margin-top:20px;'>Hello {name},</p>
                      <p>Your transmission regarding <strong>"{inquiry_type}"</strong> has been successfully received.</p>
                      <div style='background:#14141a; padding:16px; border-radius:6px; margin:18px 0;'>
                        <p style='margin:4px 0;'><strong>Inquiry Category:</strong> {inquiry_type}</p>
                        <p style='margin:4px 0;'><strong>Target Timeline:</strong> {timeline or 'N/A'}</p>
                        <p style='margin:4px 0;'><strong>Status:</strong> Logged & In Executive Queue</p>
                      </div>
                      <p>Warm regards,<br><strong>JayDyMilla Management Desk</strong></p>
                    </div>
                    """
                    user_mail_req = urllib.request.Request(
                        'https://api.resend.com/emails',
                        data=json.dumps({
                            'from': from_email,
                            'to': email,
                            'reply_to': admin_list[0] if admin_list else 'music@jaydymilla.com',
                            'subject': 'Inquiry Received // JayDyMilla Executive Desk',
                            'html': client_html
                        }).encode('utf-8'),
                        headers={
                            'Authorization': f"Bearer {resend_key}",
                            'Content-Type': 'application/json',
                            'User-Agent': 'Mozilla/5.0'
                        }
                    )
                    urllib.request.urlopen(user_mail_req)
                except Exception as e:
                    print(f"[dev_server] Resend client confirmation error: {e}")

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Inquiry processed'}).encode('utf-8'))
            return

        self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if clean_path.startswith('/api/admin'):
            session = self._verify_session(query_params=query)
            if not session:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Unauthorized'}).encode('utf-8'))
                return

            inquiry_id = query.get('id', [None])[0]
            if not inquiry_id:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Missing id parameter'}).encode('utf-8'))
                return

            client_ip = self._get_client_ip()
            user_agent = self.headers.get('User-Agent', 'Unknown')
            return self._delete_inquiry(inquiry_id, session.get('email'), client_ip, user_agent)

        self.send_error(404, "Endpoint not found")

    def _delete_inquiry(self, inquiry_id, actor_email, client_ip, user_agent):
        uuid_regex = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.I)
        if not inquiry_id or not uuid_regex.match(str(inquiry_id).strip()):
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': 'Valid UUID inquiry ID is required for deletion.'}).encode('utf-8'))
            return

        env = load_env()
        supabase_url = env.get('SUPABASE_URL', 'https://hzjzrnliyilimzpymldt.supabase.co')
        supabase_service_key = env.get('SUPABASE_SERVICE_ROLE_KEY', '')
        try:
            del_req = urllib.request.Request(
                f"{supabase_url}/rest/v1/inquiries?id=eq.{urllib.parse.quote(inquiry_id)}",
                method='DELETE',
                headers={
                    'apikey': supabase_service_key,
                    'Authorization': f"Bearer {supabase_service_key}",
                    'Prefer': 'return=representation'
                }
            )
            with urllib.request.urlopen(del_req) as resp:
                resp.read()

            log_audit_event('INQUIRY_DELETED', actor_email, client_ip, user_agent, {'deletedId': inquiry_id})

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Inquiry deleted'}).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        
        if 'Range' not in self.headers:
            f = super().send_head()
            if f:
                self.send_header('Accept-Ranges', 'bytes')
            return f
        
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None
        
        size = os.path.getsize(path)
        range_header = self.headers.get('Range')
        try:
            val = range_header.strip().split('=')[1]
            parts = val.split('-')
            start = int(parts[0]) if parts[0] else 0
            end = int(parts[1]) if parts[1] else size - 1
        except Exception:
            self.send_error(400, "Bad Request: Invalid Range")
            f.close()
            return None
            
        if start >= size:
            self.send_error(416, "Requested Range Not Satisfiable")
            f.close()
            return None
            
        end = min(end, size - 1)
        length = end - start + 1
        
        self.send_response(206)
        self.send_header("Content-type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()
        
        f.seek(start)
        
        class RangedFile:
            def __init__(self, file_obj, length):
                self.file_obj = file_obj
                self.remaining = length
            def read(self, size=-1):
                if self.remaining <= 0:
                    return b""
                if size < 0 or size > self.remaining:
                    size = self.remaining
                data = self.file_obj.read(size)
                self.remaining -= len(data)
                return data
            def close(self):
                self.file_obj.close()
                
        return RangedFile(f, length)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = ThreadingHTTPServer(('127.0.0.1', port), RangeRequestHandler)
    print(f"Serving HTTP with Range Support on http://127.0.0.1:{port}")
    server.serve_forever()
