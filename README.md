# Retayn | AI Memory & Identity Infrastructure 🌌

Retayn is a developer-first platform for building personalized AI experiences with long-term memory. It allows applications to store, retrieve, and inject user-specific facts and preferences into any AI context seamlessly.

## Architecture Overview

- **Backend**: Express.js (TypeScript)
- **AI Core**: Groq Llama 3.3 70B (via direct Axios API calls)
- **Database**: Supabase (PostgreSQL + UUIDs)
- **Auth**: API-Key based middleware (X-API-KEY header)
- **Deployed URL**: `https://retayn-ai.vercel.app`

## Key Components

- **`src/controllers/chat.ts`**: The "brain" of the demo. Handles context retrieval, LLM reasoning (using Groq), and selective memory storage.
- **`src/lib/groq.ts`**: Lightweight API client for Groq.
- **`src/lib/supabase.ts`**: Supabase client with auto-protocol fix.
- **`public/chat.html`**: The premium standalone demo.

## Setup & installation

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file with:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GROQ_API_KEY=your_groq_api_key
   PORT=3000
   ```

3. **Database Schema**:
   Run the contents of `supabase_schema.sql` in your Supabase SQL Editor.

4. **Run Dev Mode**:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /v1/chat`: Intelligent chat with memory.
- `POST /v1/memories`: Manual memory storage.
- `GET /v1/memories/:user_id`: Retrieve all memories for a user.
- `DELETE /v1/memories/:id`: Remove a memory.

---
© 2026 Retayn AI Memory. Built for the era of personalized intelligence.
