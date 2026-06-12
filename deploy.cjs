const fs = require('fs');

const out = '.vercel/output';
fs.mkdirSync(`${out}/functions/__server.func`, { recursive: true });
fs.cpSync('dist/client', `${out}/static`, { recursive: true });
fs.cpSync('dist/server', `${out}/functions/__server.func`, { recursive: true });
fs.copyFileSync('dist/config.json', `${out}/config.json`);

// Required by Vercel to configure the serverless function
fs.writeFileSync(`${out}/functions/__server.func/vc-config.json`, JSON.stringify({
  runtime: "nodejs20.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  shouldAddHelpers: true
}, null, 2));

console.log('✅ Vercel output structure created successfully');
