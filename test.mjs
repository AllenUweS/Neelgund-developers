import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kotbcwrvgekmyzovejqv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdGJjd3J2Z2VrbXl6b3ZlanF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4ODQ5MzcsImV4cCI6MjA5NDQ2MDkzN30.86mv05ykNWQajZGA4_3YvKbmgKxr42P8BMdGMPqUrPQ'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: profileRows, error: profileErr } = await supabase
    .from("profiles")
    .select("id, full_name, email, designation, avatar_url");

  console.log("Profiles Error:", profileErr);
  console.log("Profiles Count:", profileRows?.length);
  if (profileRows?.length) console.log("Sample Profile:", profileRows[0]);
  
  const { data: lpData, error: lpErr } = await supabase
    .from("location_points")
    .select("*")
    .limit(1);
    
  console.log("Location points Error:", lpErr);
  console.log("Location points sample:", lpData);
  
  const { data: llData, error: llErr } = await supabase
    .from("live_locations")
    .select("*")
    .limit(1);
    
  console.log("Live locations Error:", llErr);
  console.log("Live locations sample:", llData);
}

test()
