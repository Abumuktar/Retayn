# Retayn Developer Guide 🛠️🌌

Welcome to Retayn! This guide helps you integrate and test intelligent long-term memory in your AI applications.

## What is Retayn?
Retayn is an **Intelligent Memory Layer** for the AI era. It allows your AI models to "remember" users across sessions by automatically extracting and storing facts, preferences, and context.

### Where to use Retayn?
- **AI Companions**: Built characters that remember a user's birthday, hobby, or past secrets.
- **Intelligent CRM**: Support agents that remember a customer's past issues and brand preferences.
- **Personalized Education**: Tutors that track a student's learning progress and difficult topics.
- **E-commerce**: Assistants that remember a user's size, style, and past purchases.

## 1. Live Demo (Test it now)
The easiest way to see Retayn in action is our live dashboard. No setup required.

**🔗 [Retayn Live Demo](https://retayn-production.up.railway.app/chat.html)**

---

## 2. API as a Service (Direct Integration)
You can call the Retayn API directly from your own applications to add memory layers instantly.

- **Base URL**: `https://retayn-production.up.railway.app`
- **Auth Header**: `X-API-KEY: retayn_test_key_123` (Demo Key)

### Example: Send an Intelligent Chat Message
This endpoint automatically retrieves user context and decides if new facts should be stored.

```bash
curl -X POST "https://retayn-production.up.railway.app/v1/chat" \
     -H "Content-Type: application/json" \
     -H "X-API-KEY: retayn_test_key_123" \
     -d '{
           "user_id": "alex_rivera_001",
           "message": "I live in San Francisco and I love pepperoni pizza."
         }'
```

---

## 3. Recommended Testing Flow
Follow these steps to verify that Retayn is "learning" about your user:

1.  **Feed Data**: Send a message like *"My name is Alex Rivera"* via the API or Demo.
2.  **Verify Bank**: Notice the fact appears in the sidebar of the Demo.
3.  **Test Recall**: Clear your local session, then ask *"What is my name?"*
4.  **Result**: Retayn will answer correctly by pulling from its long-term memory.

---

## 4. Developer Principles
- **Identity First**: Memories are tied to `user_id`, allowing users to carry their identity across different sessions.
- **Selective Sync**: Retayn uses LLM reasoning to ensure only relevant facts (not small talk) are stored.
- **Privacy Separation**: Your LLM handles the response, Retayn handles the memory.

---

### Appendix: Local Development (Optional)
If you want to run the Retayn core locally for development:
1. `npm install`
2. Create `.env` (see README.md for variables)
3. `npm run dev`
4. Access at `http://localhost:3000/chat.html`

> [!NOTE]
> For full technical architecture and setup details, please refer to the **[README.md](file:///c:/Users/dell/Desktop/Elio/README.md)**.
