const supabaseUrl = 'https://qfiqhwyrcfulqntwroqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaXFod3lyY2Z1bHFudHdyb3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwOTQ4MDQsImV4cCI6MjA5ODY3MDgwNH0.V7T_MjIVdAn1AXATP9emXAecT1sa3G05UWysATMP5-I';

async function test() {
  const url = `${supabaseUrl}/rest/v1/chapters?select=*`;
  console.log('Fetching', url);
  
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  
  console.log('Status:', response.status);
  const text = await response.text();
  console.log('Response:', text);
}

test();
