import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class RangeRequestHandler(SimpleHTTPRequestHandler):
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
