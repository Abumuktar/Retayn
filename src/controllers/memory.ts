import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { groqChat } from '../lib/groq';

export const storeMemory = async (req: Request, res: Response) => {
  const { user_id, content, type } = req.body;
  const appId = (req as any).app_id;

  if (!user_id || !content) {
    return res.status(400).json({ error: 'user_id and content are required' });
  }

  // 1. Store in Supabase
  const { data, error } = await supabase
    .from('memories')
    .insert([{ user_id, content, app_id: appId, type: type || 'fact' }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 2. Generate AI Response with Groq
  let aiResponse = "Got it. I've safely stored that in my memory.";
  try {
    const messages = [
      {
        role: "system",
        content: "You are Retayn, an AI memory assistant. Your goal is to acknowledge the user's input and briefly state that you've remembered it. Keep it concise, friendly, and helpful."
      },
      {
        role: "user",
        content: `The user just told me: "${content}". Please acknowledge this and confirm it's stored.`
      }
    ];

    const result = await groqChat(messages);
    aiResponse = result.choices[0]?.message?.content || aiResponse;
  } catch (groqError) {
    console.error('Groq Error:', groqError);
  }

  res.status(201).json({
    memory_id: data.id,
    created_at: data.created_at,
    response: aiResponse
  });
};

export const getMemories = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { query } = req.query; // Basic keyword search
  const appId = (req as any).app_id;

  let dbQuery = supabase
    .from('memories')
    .select('*')
    .eq('user_id', user_id);

  if (appId) {
    dbQuery = dbQuery.eq('app_id', appId);
  } else {
    dbQuery = dbQuery.is('app_id', null);
  }

  if (query) {
    dbQuery = dbQuery.ilike('content', `%${query}%`);
  }

  const { data, error } = await dbQuery.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

export const deleteMemory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const appId = (req as any).app_id;

  let dbQuery = supabase
    .from('memories')
    .delete()
    .eq('id', id);

  if (appId) {
    dbQuery = dbQuery.eq('app_id', appId);
  } else {
    dbQuery = dbQuery.is('app_id', null);
  }

  const { error } = await dbQuery;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
};
