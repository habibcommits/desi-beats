import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse } from '../_utils/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return successResponse(res, { success: true, message: "Logged out successfully" });
}
