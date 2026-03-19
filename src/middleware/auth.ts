import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-KEY');

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key is required in X-API-KEY header' });
  }

  // Check API Key in Supabase
  const { data, error } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key', apiKey)
    .single();

  if (error || !data) {
    return res.status(403).json({ error: 'Invalid API Key' });
  }

  // Attach app_id to request for downstream use
  (req as any).app_id = data.id;
  next();
};
