const API_URL = 'https://retayn-production.up.railway.app/v1';
const API_KEY = 'retayn_test_key_123';

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const memoryList = document.getElementById('memory-list');
const memoryStatus = document.getElementById('memory-status');
const refreshBtn = document.getElementById('refresh-btn');

// Persist User ID so refresh doesn't wipe everything
if (!localStorage.getItem('retayn_user_id')) {
    localStorage.setItem('retayn_user_id', 'demo_user_' + Math.random().toString(36).substr(2, 9));
}
const USER_ID = localStorage.getItem('retayn_user_id');

// Initialize
addMessage("System: Connected to " + API_URL, 'ai');
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
        console.log('Sending to Retayn...', { user_id: USER_ID, content: message });
        const res = await fetch(`${API_URL}/memories`, {
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
        
        const result = await res.json();
        console.log('Retayn Saved:', result);

        // 3. Refresh Memory Bank visually
        await fetchMemories();

        // 4. Real AI Response from Backend
        if (result.response) {
            addMessage(result.response, 'ai');
        } else {
            addMessage(`Got it. I've safely stored that in my memory.`, 'ai');
        }

    } catch (error) {
        console.error('Retayn Error:', error);
        addMessage('❌ Error: Could not reach Retayn. (Check Console F12 for details)', 'ai');
    }
});

refreshBtn.onclick = () => fetchMemories();

async function fetchMemories() {
    try {
        memoryStatus.textContent = 'Reading from Retayn...';
        const response = await fetch(`${API_URL}/memories/${USER_ID}`, {
            headers: { 'X-API-KEY': API_KEY }
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const memories = await response.json();
        console.log('Retrieved memories:', memories);
        updateMemoryPanel(memories);
        memoryStatus.textContent = '';
    } catch (error) {
        console.error('Fetch Error:', error);
        memoryStatus.textContent = '❌ Sync Error: ' + error.message;
    }
}

function updateMemoryPanel(memories) {
    if (!memories || !Array.isArray(memories)) {
        console.error('Invalid memories data:', memories);
        return;
    }
    
    if (memories.length === 0) {
        memoryList.innerHTML = '<div class="empty-state">No memories yet. Start typing!</div>';
        return;
    }

    memoryList.innerHTML = '';
    memories.forEach(mem => {
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
