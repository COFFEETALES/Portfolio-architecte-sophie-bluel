
###
# Script bash ayant pour but d'ajouter simplement un utilisateur dans la base;
###

# apt install apache2-utils

apt install python3-bcrypt
cd /mnt/c/dev/ocr/Portfolio-architecte-sophie-bluel/Backend
EMAIL="coffee@coffeetales.net"
PASSWORD='P@ssWord'
PASSWORD="$(python3 -c "import bcrypt; print(bcrypt.hashpw(b'${PASSWORD}', bcrypt.gensalt(10)).decode())")"
sqlite3 database.sqlite "delete from users where email = '${EMAIL}';"
sqlite3 database.sqlite "insert into users (email, password) values ('${EMAIL}', '${PASSWORD}');"
sqlite3 database.sqlite -header "select * from users;"



###
# Serveur web pour le front avec les rewrite-rules intégrées
###

@'
import http.server
import re

class RewritingHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        #if self.path == '/old-path':
        #    self.send_response(301)
        #    self.send_header('Location', '/new-path')
        #    self.end_headers()
        #    return
        if re.match(r'^/([\w]+)$', self.path):
            self.path = f'/index.html'
        return super().do_GET()

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = http.server.HTTPServer(server_address, RewritingHTTPRequestHandler)
    print(f"Serving on port 8000")
    httpd.serve_forever()
EOF
'@ | python3
