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

app.use(cors()); // Back to simpler CORS since same-origin will be used
app.use(express.json());
app.use(express.static('public'));

// Basic Heartbeat
app.get('/health', (req, res) => {
  res.json({ status: 'alive', service: 'Retayn API' });
});

// Elio Core Endpoints
app.post('/v1/memories', authMiddleware, storeMemory);
app.get('/v1/memories/:user_id', authMiddleware, getMemories);
app.delete('/v1/memories/:id', authMiddleware, deleteMemory);

// Start Server
app.listen(port, () => {
  console.log(`Retayn Core API listening at http://localhost:${port}`);
});
