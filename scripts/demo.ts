import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:3000/v1';
const API_KEY = 'your_test_api_key'; // Create this in Supabase first
const USER_ID = 'demo_user_001';

async function elioDemo() {
  console.log("🌌 Retayn Demo Started...");

  // 1. Store a fact
  await axios.post(`${API_URL}/memories`,
    { user_id: USER_ID, content: "My name is Abubakar and I love Retayn.", type: 'fact' },
    { headers: { 'X-API-KEY': API_KEY } }
  );

  // 2. Retrieve it
  const { data } = await axios.get(`${API_URL}/memories/${USER_ID}`, { headers: { 'X-API-KEY': API_KEY } });

  console.log(`🤖 AI Remembered: "${data[0].content}"`);
}

elioDemo();
