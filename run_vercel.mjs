async function start() {
  const mod = await import('./.vercel/output/functions/__server.func/index.mjs');
  const app = mod.default;

  const req = new Request("http://localhost:3005/");
  const res = await app.fetch(req);
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}

start().catch(console.error);
