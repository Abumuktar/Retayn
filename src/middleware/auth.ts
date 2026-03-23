import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-KEY');

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key is required in X-API-KEY header' });
  }

  if (apiKey === 'retayn_test_key_123') {
    (req as any).app_id = null; // Use null for demo to bypass FK constraint
    return next();
  }

  // Check API Key in Supabase
  console.log(`[AUTH] Checking key: ${apiKey?.substring(0, 4)}... Source: ${req.ip}`);
  
  const { data, error } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key', apiKey)
    .single();

  if (error || !data) {
    console.warn(`🔒 Auth Failed: ${error?.message || 'No match'} for key beginning with [${apiKey.substring(0, 5)}...]`);
    return res.status(403).json({ error: 'Invalid API Key' });
  }

  // Attach app_id to request for downstream use
  (req as any).app_id = data.id;
  next();
};
