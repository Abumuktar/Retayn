# 🌌 Retayn: AI Memory & Identity Infrastructure

> "The default memory layer for the AI era."

Elio gives your AI applications persistent, structured memory via a single, developer-friendly API. Stop rebuilding context storage and start building better AI products.

---

## 🚀 Quick Start (Under 10 Minutes)

### 1. Setup Supabase
Run the provided `supabase_schema.sql` in your Supabase SQL Editor.

### 2. Configure Environment
Copy `.env.example` to `.env` and add your Supabase credentials:
```bash
# Production URL: https://retayn-production.up.railway.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3000
```

### 3. Install & Start
```bash
npm install
npm run dev
```

---

## 🛠️ API Reference

All requests require the `X-API-KEY` header.

### 📥 Store Memory
`POST /v1/memories`
```bash
curl -X POST https://retayn-production.up.railway.app/v1/memories \
  -H "X-API-KEY: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "content": "User prefers concise responses and dark mode.",
    "type": "preference"
  }'
```

### 🔍 Retrieve Memories
`GET /v1/memories/:user_id?query=concise`
```bash
curl -H "X-API-KEY: your_api_key" \
  "http://localhost:3000/v1/memories/user_123?query=concise"
```

### 🗑️ Delete Memory
`DELETE /v1/memories/:id`
```bash
curl -X DELETE -H "X-API-KEY: your_api_key" \
  "http://localhost:3000/v1/memories/mem_abc123"
```

---

## 🎨 Brand Identity
- **Primary Background**: `#0A0F1E` (Deep Intelligence)
- **Accent**: `#4F8EF7` (Electric Blue)
- **Surface**: `#F4F6FF` (Cool White)

---

## 🎓 Demo Chatbot (10 lines)
Check out `scripts/demo.ts` for a simple implementation showing Elio in action.

---
Built with 💙 for the African developer ecosystem.
