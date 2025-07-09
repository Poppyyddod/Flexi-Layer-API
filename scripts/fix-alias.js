const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = require(pkgPath);

// กำหนด alias แยกตาม environment
const devAliases = {
    "@SRC": "src",
    "@Helper": "src/Helper",
    "@Configs": "Configs",
    "@Store": "src/Store",
    "@Testing": "src/Testing"
};

const prodAliases = {
    "@SRC": "dist/src",
    "@Helper": "dist/src/Helper",
    "@Configs": "dist/Configs",
    "@Store": "dist/src/Store",
    "@Testing": "dist/src/Testing"
};

// เลือก alias ตาม NODE_ENV หรือ default เป็น dev
const env = process.env.NODE_ENV || 'development';
const aliasesToSet = env === 'production' ? prodAliases : devAliases;

// ตั้งค่า alias ใน package.json
pkg._moduleAliases = aliasesToSet;

// เขียนทับ package.json
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log(`✅ Updated module-aliases for ${env} environment.`);
