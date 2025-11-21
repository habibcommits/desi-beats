import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse, notFoundResponse } from '../_utils/response';
import { getStorage } from '../_utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return errorResponse(res, 'Invalid category ID', 400);
    }

    const storage = await getStorage();
    const category = await storage.getCategoryById(id);
    
    if (!category) {
      return notFoundResponse(res, 'Category not found');
    }

    return successResponse(res, category);
  } catch (error) {
    console.error('[API] Failed to fetch category:', error);
    return errorResponse(res, 'Failed to fetch category');
  }
}
