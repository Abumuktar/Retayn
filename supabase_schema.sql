-- Retayn MVP Database Schema
-- Run this in the Supabase SQL Editor

-- 1. Create API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Memories table
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    app_id UUID REFERENCES api_keys(id),
    type TEXT DEFAULT 'fact', -- 'fact', 'preference', 'event'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Enable Row Level Security (Initial MVP is simple, but good to have)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Note: In Phase 1, the API Key will be checked by the middleware.
-- For now, we allow the service role or authenticated keys to access the tables.
