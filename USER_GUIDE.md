# Retayn Developer & Testing Guide 🛠️

Welcome to the Retayn MVP! This guide will help you test the intelligent memory features in under 5 minutes.

## 1. Quick Start

1. Start the API: `npm run dev`
2. Open your browser to: `http://localhost:3000/chat.html`

## 2. Testing the "Intelligence"

The demo uses a **Dummy API Key** (`elio_test_key_123`) so you don't need to configure keys in the database to start.

### Phase 1: Storage
Try talking naturally to the bot:
- *"My name is Abubakar Muktar"*
- *"I am based in Katsina"*
- *"I love fried rice with chicken"*

**Check it out:** Watch the **"Retayn Bank"** sidebar on the left. It updates in real-time as Retayn extracts these facts from your messages.

### Phase 2: Recall
Clear the chat history (using the "Clear History" button) and ask:
- *"What is my name?"*
- *"Where do I live?"*
- *"What is my favorite food?"*

**Expected Result:** Retayn should answer correctly by pulling from its long-term memory bank, even if the current chat history is empty.

## 3. API as a Service (Direct Access)

You can call the Retayn API directly from your own applications or using tools like `curl`.

- **Base URL**: `https://retayn-production.up.railway.app`
- **Authentication Header**: `X-API-KEY: retayn_test_key_123` (Demo Key)

### Example: Send a Chat Message
```bash
curl -X POST "https://retayn-production.up.railway.app/v1/chat" \
     -H "Content-Type: application/json" \
     -H "X-API-KEY: retayn_test_key_123" \
     -d '{
           "user_id": "test_user_999",
           "message": "I am a senior developer who loves TypeScript."
         }'
```

---

## 4. Developer Notes

- **One-File Demo**:
    - **Local**: `http://localhost:3000/chat.html`
    - **Live (Railway)**: `https://retayn-production.up.railway.app/chat.html`
- **Selective Storage**: Retayn uses Groq (Llama 3.3 70B) to decide what's worth remembering. Small talk is ignored; facts are stored!

## 4. Troubleshooting

- **Server Error?** Ensure your `.env` has a valid `GROQ_API_KEY`.
- **Memory Not Saving?** Check your terminal logs. The system uses `console.log` to show when it identifies a new memory to store.

Happy Testing! 🚀
