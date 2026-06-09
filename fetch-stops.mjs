const supabaseUrl = 'https://kotbcwrvgekmyzovejqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdGJjd3J2Z2VrbXl6b3ZlanF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg4NDkzNywiZXhwIjoyMDk0NDYwOTM3fQ.LGh-bT1-zlT2o7vTGHc_tG5w8w9iIXS8GuPuWt08HIk';
async function run() {
  const res = await fetch(supabaseUrl + '/rest/v1/stops?select=*', {
    headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
  });
  const data = await res.json();
  console.log('Stops data:', data);
}
run();
