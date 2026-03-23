import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('Checking Supabase connection...');
    console.log(`URL: ${supabaseUrl}`);

    // Check api_keys table
    const { data: keys, error: keysError } = await supabase.from('api_keys').select('id').limit(1);
    if (keysError) {
        console.error('❌ Error accessing api_keys table:', keysError.message);
    } else {
        console.log('✅ api_keys table is accessible');
    }

    // Check memories table
    const { data: memories, error: memError } = await supabase.from('memories').select('id').limit(1);
    if (memError) {
        console.error('❌ Error accessing memories table:', memError.message);
    } else {
        console.log('✅ memories table is accessible');
    }
}

checkTables();
