import { supabase } from './src/lib/supabase';

async function setupDemoKey() {
  console.log("🛠️ Setting up Demo API Key...");
  const DUMMY_ID = '00000000-0000-0000-0000-000000000000';
  const DUMMY_KEY = 'elio_test_key_123';

  const { data, error } = await supabase
    .from('api_keys')
    .upsert([
      { id: DUMMY_ID, key: DUMMY_KEY, name: 'Retayn Demo Key' }
    ], { onConflict: 'id' });

  if (error) {
    console.error("❌ Setup Failed:", error.message);
  } else {
    console.log("✅ Demo API Key ready in database.");
  }
}

setupDemoKey();
