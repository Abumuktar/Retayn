const API_URL = 'https://retayn-production.up.railway.app/v1';
const API_KEY = 'retayn_test_key_123';

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const memoryList = document.getElementById('memory-list');
const memoryStatus = document.getElementById('memory-status');
const refreshBtn = document.getElementById('refresh-btn');

// Mobile Menu Elements
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const sidebar = document.getElementById('memory-panel');
const overlay = document.getElementById('sidebar-overlay');

// Mobile Menu Logic
function toggleMobileMenu(show) {
    if (show) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

menuToggle.addEventListener('click', () => toggleMobileMenu(true));
closeSidebar.addEventListener('click', () => toggleMobileMenu(false));
overlay.addEventListener('click', () => toggleMobileMenu(false));

// Persist User ID so refresh doesn't wipe everything
if (!localStorage.getItem('retayn_user_id')) {
    localStorage.setItem('retayn_user_id', 'demo_user_' + Math.random().toString(36).substr(2, 9));
}
const USER_ID = localStorage.getItem('retayn_user_id');

// Initialize
// (Add a small delay to make the connection feel real)
setTimeout(() => {
    addMessage("System: Connected to " + API_URL, 'ai');
    fetchMemories();
}, 500);

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
        memoryList.innerHTML = '<div class="text-white/40 text-sm text-center mt-10">No memories yet. Start typing!</div>';
        return;
    }

    memoryList.innerHTML = '';
    memories.forEach(mem => {
        const card = document.createElement('div');
        card.className = 'bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#4F8EF7] hover:bg-[#4F8EF7]/5 transition-all group';
        card.innerHTML = `
            <div class="text-sm leading-relaxed mb-2">${mem.content}</div>
            <div class="text-[0.65rem] text-white/40 group-hover:text-[#4F8EF7]/70 transition-colors uppercase tracking-tight">${new Date(mem.created_at).toLocaleTimeString()}</div>
        `;
        memoryList.appendChild(card);
    });
}

function addMessage(text, side) {
    const msgDiv = document.createElement('div');
    const isAi = side === 'ai';
    msgDiv.className = isAi 
        ? "max-w-[85%] md:max-w-[70%] p-4 md:p-5 rounded-2xl md:rounded-[2rem] rounded-bl-none md:rounded-bl-[0.5rem] bg-[#141B2D] border border-white/5 text-sm md:text-base leading-relaxed self-start"
        : "max-w-[85%] md:max-w-[70%] p-4 md:p-5 rounded-2xl md:rounded-[2rem] rounded-br-none md:rounded-br-[0.5rem] bg-[#4F8EF7] text-white text-sm md:text-base leading-relaxed self-end";
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
