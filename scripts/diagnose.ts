import axios from 'axios';

const API_URL = 'https://retayn-production.up.railway.app/v1';
const API_KEY = 'retayn_test_key_123';
const USER_ID = 'diagnostic_test_user_' + Date.now();

async function runDiagnostics() {
    console.log('--- Retayn API Diagnostics ---');
    console.log(`URL: ${API_URL}`);
    console.log(`User ID: ${USER_ID}`);

    // 1. Health Check
    try {
        const health = await axios.get(`${API_URL.replace('/v1', '')}/health`);
        console.log('✅ Health Check:', health.data);
    } catch (e) {
        console.error('❌ Health Check Failed:', e.message);
    }

    // 2. Fetch Memories
    try {
        console.log('\nFetching memories...');
        const res = await axios.get(`${API_URL}/memories/${USER_ID}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        console.log('✅ Fetch Memories:', res.status, res.data);
    } catch (e) {
        console.error('❌ Fetch Memories Failed:', e.status, e.response?.data || e.message);
    }

    // 3. Chat
    try {
        console.log('\nTesting Chat...');
        const res = await axios.post(`${API_URL}/chat`, {
            user_id: USER_ID,
            message: 'Hello, I am a diagnostic test.'
        }, {
            headers: { 'X-API-KEY': API_KEY }
        });
        console.log('✅ Chat Success:', res.status, res.data);
    } catch (e) {
        console.error('❌ Chat Failed:', e.status, e.response?.data || e.message);
    }
}

runDiagnostics();
