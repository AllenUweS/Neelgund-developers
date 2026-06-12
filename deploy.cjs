const fs = require('fs');

const out = '.vercel/output';
fs.mkdirSync(`${out}/functions/__server.func`, { recursive: true });
fs.cpSync('dist/client', `${out}/static`, { recursive: true });
fs.cpSync('dist/server', `${out}/functions/__server.func`, { recursive: true });
fs.copyFileSync('dist/config.json', `${out}/config.json`);

console.log('✅ Vercel output structure created successfully');
