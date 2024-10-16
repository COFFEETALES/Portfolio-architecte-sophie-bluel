import http.server
import re

class RewritingHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if re.match(r'^/([\w]+)$', self.path):
            self.path = f'/index.html'
        return super().do_GET()

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = http.server.HTTPServer(server_address, RewritingHTTPRequestHandler)
    print(f"Serving on port 8000")
    httpd.serve_forever()
