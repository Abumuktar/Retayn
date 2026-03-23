const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('Verifying Supabase tables...');
  
  const { data, error } = await supabase
    .from('memories')
    .select('id')
    .limit(1);

  if (error) {
    console.error('❌ Error accessing memories table:', error.message);
    if (error.message.includes('relation "public.memories" does not exist')) {
        console.error('💡 HINT: The memories table is missing. Run supabase_schema.sql in the Supabase SQL editor.');
    }
  } else {
    console.log('✅ memories table exists and is accessible.');
  }

  const { data: keys, error: keysError } = await supabase
    .from('api_keys')
    .select('id')
    .limit(1);

  if (keysError) {
    console.error('❌ Error accessing api_keys table:', keysError.message);
  } else {
    console.log('✅ api_keys table exists and is accessible.');
  }
}

verify();
