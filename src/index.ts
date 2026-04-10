import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import { supabase } from './lib/supabase';

import { authMiddleware } from './middleware/auth';
import { storeMemory, getMemories, deleteMemory } from './controllers/memory';
import { handleChat } from './controllers/chat';

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'X-API-KEY'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(express.static('public'));

// Basic Heartbeat
app.get('/health', (req, res) => {
  res.json({ status: 'alive', service: 'Retayn API' });
});

// Retayn Core Endpoints
app.post('/v1/chat', authMiddleware, handleChat);
app.post('/v1/memories', authMiddleware, storeMemory);
app.get('/v1/memories/:user_id', authMiddleware, getMemories);
app.delete('/v1/memories/:id', authMiddleware, deleteMemory);

// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Retayn Core API listening at http://localhost:${port}`);
  });
}

export default app;
