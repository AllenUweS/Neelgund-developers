async function run() {
  try {
    const res = await fetch("http://localhost:3002/");
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (err) {
    console.error(err);
  }
}
run();
