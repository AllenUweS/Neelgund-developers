const supabaseUrl = 'https://kotbcwrvgekmyzovejqv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdGJjd3J2Z2VrbXl6b3ZlanF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg4NDkzNywiZXhwIjoyMDk0NDYwOTM3fQ.LGh-bT1-zlT2o7vTGHc_tG5w8w9iIXS8GuPuWt08HIk'

async function checkProfiles() {
  const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=name,profile_photo_url&profile_photo_url=not.is.null`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  const data = await res.json();
  console.log("Profiles Sample:", data);
}

async function checkLiveLocations() {
  const res = await fetch(`${supabaseUrl}/rest/v1/live_locations?select=*&limit=1`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  const data = await res.json();
  console.log("Live Locations Sample:", data);
}

async function checkLocationPoints() {
  const res = await fetch(`${supabaseUrl}/rest/v1/location_points?select=*&limit=1`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  const data = await res.json();
  console.log("Location Points Sample:", data);
}

checkProfiles().then(checkLiveLocations).then(checkLocationPoints);
