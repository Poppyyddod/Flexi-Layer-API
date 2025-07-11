### By yddod_
## Installtion, ENV Config & Run the server
- **Step 1 :** Install dependencies:
```sh
npm install
npm run build
```
- **Step 2 :** Create your `.env`, `.env.development` and `.env.production` files.
```sh
# Project environment
NODE_ENV=#environment

# HTTP Server Port For Testing
HTTP_PORT=#port_number
# HTTPS Server Port For Production
HTTPS_PORT=#port_number

# Hostname
HOST=#hostname

# MySQL username
MYSQL_USER=#username
# MySQL password
MYSQL_PASSWORD=#password
# MySQL database name
MYSQL_DATABASE=#database_name

# JWT
SECRET_KEY=#access
REFRESH_KEY=#refresh
```
- **Step 3 :** Run the server : `dev` or `prod`
```sh
npm run dev
npm run prod
```
## Enjoy the project!
