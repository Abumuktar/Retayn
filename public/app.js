// Retayn App.js - VERSION 2.1 (Localhost Focus)
console.log("🌌 Retayn Demo V2.1 Initialized");

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') 
    ? 'http://localhost:3000/v1' 
    : '/v1';
const API_KEY = 'elio_test_key_123';

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

const memorySearch = document.getElementById('memory-search');

// Search Event
memorySearch.addEventListener('input', (e) => {
    fetchMemories(e.target.value);
});

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
        await fetch(`${API_URL}/memories`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY },
            body: JSON.stringify({ user_id: USER_ID, content: message })
        });
        
        await fetchMemories();

        // 4. SMART AI RESPONSE: Questions vs. Statements
        const isQuestion = message.toLowerCase().match(/(what|who|remember|about|tell|know)/);
        let queryTerm = message.split(' ').pop().replace(/[?!.]/, "");
        
        // If it looks like a "What about..." or "Tell me about..." question, try to find a better keyword
        if (message.toLowerCase().includes('about ')) {
            queryTerm = message.toLowerCase().split('about ').pop().replace(/[?!.]/, "");
        }

        const searchRes = await fetch(`${API_URL}/memories/${USER_ID}?query=${queryTerm}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        const pastMemories = await searchRes.json();

        setTimeout(() => {
            if (isQuestion && pastMemories.length > 0) {
                // Find a relevant memory that isn't the current message
                const relevant = pastMemories.find(m => m.content.toLowerCase() !== message.toLowerCase());
                if (relevant) {
                    addMessage(`I looked into my memories! I remember you mentioned: "${relevant.content}"`, 'ai');
                } else {
                    addMessage(`I don't have a specific memory about "${queryTerm}" yet, but I've saved this conversation.`, 'ai');
                }
            } else if (pastMemories.length > 1) {
                const fact = pastMemories.find(m => m.content !== message);
                addMessage(`Interesting! That reminds me of when you said: "${fact.content}"`, 'ai');
            } else {
                addMessage(`Noted. I've added that to your memory bank.`, 'ai');
            }
        }, 600);

    } catch (error) {
        addMessage('⚠️ Sync Error. Check console.', 'ai');
    }
});

refreshBtn.onclick = () => fetchMemories();

async function fetchMemories(query = '') {
    try {
        memoryStatus.innerHTML = '<span class="loading-spinner"></span> Updating...';
        const url = query ? `${API_URL}/memories/${USER_ID}?query=${query}` : `${API_URL}/memories/${USER_ID}`;
        const response = await fetch(url, {
            headers: { 'X-API-KEY': API_KEY }
        });

        if (!response.ok) {
            if (response.status === 403) throw new Error("Invalid API Key. Please check Supabase.");
            throw new Error(`Server error: ${response.status}`);
        }

        const memories = await response.json();
        updateMemoryPanel(memories);
        memoryStatus.textContent = '';
    } catch (error) {
        memoryStatus.textContent = '❌ Sync Error';
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
