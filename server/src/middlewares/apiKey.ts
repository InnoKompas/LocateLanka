import { Request, Response, NextFunction } from 'express';
import { getDb } from '../lib/db';

export async function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('x-api-key');
  if (!apiKey) {
    return res.status(401).json({ error: 'API key missing' });
  }
  try {
    const db = getDb();
    const keyDoc = await db.collection('api_keys').findOne({ key: apiKey, active: true });
    if (!keyDoc) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    // Optionally attach key info to request
    (req as any).apiKeyInfo = keyDoc;
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
