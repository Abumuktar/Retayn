const API_URL = 'https://retayn-production.up.railway.app/v1';
const API_KEY = 'elio_test_key_123';
const USER_ID = 'demo_user_' + Math.random().toString(36).substr(2, 9);

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const memoryList = document.getElementById('memory-list');

// Initialize
fetchMemories();

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Add User Message to UI
    addMessage(message, 'user');
    userInput.value = '';

    // 2. Store in Retayn
    try {
        await fetch(`${API_URL}/memories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({
                user_id: USER_ID,
                content: message,
                type: 'fact'
            })
        });

        // 3. Refresh Memory Bank visually
        fetchMemories();

        // 4. Fake AI Response
        setTimeout(() => {
            addMessage(`Got it. I've safely stored that in my memory. Check the sidebar!`, 'ai');
        }, 800);

    } catch (error) {
        console.error('Retayn Error:', error);
        addMessage('❌ Error talking to Retayn server.', 'ai');
    }
});

async function fetchMemories() {
    try {
        const response = await fetch(`${API_URL}/memories/${USER_ID}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        const memories = await response.json();
        updateMemoryPanel(memories);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

function updateMemoryPanel(memories) {
    if (!memories.length) return;
    
    memoryList.innerHTML = '';
    memories.reverse().forEach(mem => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="content">${mem.content}</div>
            <div class="timestamp">${new Date(mem.created_at).toLocaleTimeString()}</div>
        `;
        memoryList.appendChild(card);
    });
}

function addMessage(text, side) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${side}-message`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
