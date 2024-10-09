
# Script bash ayant pour but d'ajouter simplement un utilisateur dans la base;

# apt install apache2-utils

apt install python3-bcrypt
cd /mnt/c/dev/ocr/Portfolio-architecte-sophie-bluel/Backend
EMAIL="joffrey.romero@outlook.com"
PASSWORD='P@ssWord'
PASSWORD="$(python3 -c "import bcrypt; print(bcrypt.hashpw(b'${PASSWORD}', bcrypt.gensalt(10)).decode())")"
sqlite3 database.sqlite "delete from users where email = '${EMAIL}';"
sqlite3 database.sqlite "insert into users (email, password) values ('${EMAIL}', '${PASSWORD}');"
sqlite3 database.sqlite -header "select * from users;"

