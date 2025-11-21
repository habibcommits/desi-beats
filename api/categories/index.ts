import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse } from '../_utils/response';
import { getStorage } from '../_utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    const storage = await getStorage();
    const categories = await storage.getCategories();
    return successResponse(res, categories);
  } catch (error) {
    console.error('[API] Failed to fetch categories:', error);
    return errorResponse(res, 'Failed to fetch categories');
  }
}
