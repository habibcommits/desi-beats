import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const configPath = path.join(process.cwd(), 'hero-slider-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return res.status(200).json(config);
  } catch (error) {
    console.error('Hero slider API error:', error);
    return res.status(200).json({ slides: [] });
  }
}
