import os
import sys
import json
import urllib.request
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

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

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey')
        self.end_headers()

    def do_POST(self):
        if self.path.startswith('/api/inquiry'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            env = load_env()
            try:
                body = json.loads(post_data.decode('utf-8'))
            except Exception:
                body = {}

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
