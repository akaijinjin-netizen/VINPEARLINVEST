const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking deposits...");
  const { data: deposits, error: depErr } = await supabase
    .from('deposits')
    .select('*, profiles!deposits_user_id_fkey(phone, full_name)');
  
  if (depErr) {
    console.error("Deposits Error:", depErr);
  } else {
    console.log(`Found ${deposits.length} deposits:`, deposits);
  }

  console.log("\nChecking withdrawals...");
  const { data: withdrawals, error: withErr } = await supabase
    .from('withdrawals')
    .select('*, profiles!withdrawals_user_id_fkey(phone, full_name)');

  if (withErr) {
    console.error("Withdrawals Error:", withErr);
  } else {
    console.log(`Found ${withdrawals.length} withdrawals:`, withdrawals);
  }
}

main();
