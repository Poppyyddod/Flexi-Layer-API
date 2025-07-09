### By yddod_
## Installtion, ENV Config & Run the server
- **Step 1 :** Install dependencies:
```sh
npm install
```
- **Step 2 :** Build Dist:
```sh
npm run build
```
- **Step 3 :** Fix your `.env` file
```sh
# Project environment
NODE_ENV=#environment

# Server port
HTTP_PORT=#port_number
HTTPS_PORT=#port_number

# Hostname
HOST=#hostname

# MySQL username
MYSQL_USER=#username
# MySQL password
MYSQL_PASSWORD=#password
# MySQL database name
MYSQL_DATABASE=#database_name
# MySQL/Tables
MYSQL_STORE_MAPPING="
#table_name:table_name,
..."

# JWT
SECRET_KEY=#access
REFRESH_KEY=#refresh

# Discord
DISCORD_BOT_TOKEN=#BOT_TOKEN
DISCORD_CHANNEL_ID=#CHANNEL_ID
```
- **Step 4 :** Run the server
```sh
#For development
npm run dev

#For Production
npm run prod
```
## Enjoy the project!
