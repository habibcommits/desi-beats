import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse } from '../_utils/response';
import { getStorage } from '../_utils/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    const storage = await getStorage();
    const { categoryId, featured } = req.query;

    if (categoryId && typeof categoryId === 'string') {
      const items = await storage.getMenuItemsByCategory(categoryId);
      return successResponse(res, items);
    }

    if (featured === 'true') {
      const allItems = await storage.getMenuItems();
      const featuredItems = allItems.filter(item => item.featured === true);
      return successResponse(res, featuredItems);
    }

    const items = await storage.getMenuItems();
    return successResponse(res, items);
  } catch (error) {
    console.error('[API] Failed to fetch menu items:', error);
    return errorResponse(res, 'Failed to fetch menu items');
  }
}
