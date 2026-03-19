import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const storeMemory = async (req: Request, res: Response) => {
  const { user_id, content, type } = req.body;
  const appId = (req as any).app_id;

  if (!user_id || !content) {
    return res.status(400).json({ error: 'user_id and content are required' });
  }

  const { data, error } = await supabase
    .from('memories')
    .insert([{ user_id, content, app_id: appId, type: type || 'fact' }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    memory_id: data.id,
    created_at: data.created_at
  });
};

export const getMemories = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { query } = req.query; // Basic keyword search
  const appId = (req as any).app_id;

  let dbQuery = supabase
    .from('memories')
    .select('*')
    .eq('user_id', user_id)
    .eq('app_id', appId);

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

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)
    .eq('app_id', appId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
};
