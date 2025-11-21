import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse, notFoundResponse } from '../_utils/response';
import { getStorage } from '../_utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return errorResponse(res, 'Invalid menu item ID', 400);
    }

    const storage = await getStorage();
    const item = await storage.getMenuItemById(id);
    
    if (!item) {
      return notFoundResponse(res, 'Menu item not found');
    }

    return successResponse(res, item);
  } catch (error) {
    console.error('[API] Failed to fetch menu item:', error);
    return errorResponse(res, 'Failed to fetch menu item');
  }
}
