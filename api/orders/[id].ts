import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse, notFoundResponse, badRequestResponse } from '../_utils/response';
import { getStorage } from '../_utils/storage';
import { z } from 'zod';

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'completed', 'cancelled']).optional(),
  notes: z.string().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return errorResponse(res, 'Invalid order ID', 400);
  }

  const storage = await getStorage();

  if (req.method === 'GET') {
    try {
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return notFoundResponse(res, 'Order not found');
      }

      return successResponse(res, order);
    } catch (error) {
      console.error('[API] Failed to fetch order:', error);
      return errorResponse(res, 'Failed to fetch order');
    }
  }

  if (req.method === 'PATCH') {
    try {
      const updates = updateOrderSchema.parse(req.body);
      const order = await storage.updateOrder(id, updates);
      
      if (!order) {
        return notFoundResponse(res, 'Order not found');
      }

      return successResponse(res, order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return badRequestResponse(res, 'Invalid update data', error.errors);
      }
      console.error('[API] Failed to update order:', error);
      return errorResponse(res, 'Failed to update order');
    }
  }

  if (req.method === 'DELETE') {
    try {
      await storage.deleteOrder(id);
      return successResponse(res, { success: true });
    } catch (error) {
      console.error('[API] Failed to delete order:', error);
      return errorResponse(res, 'Failed to delete order');
    }
  }

  return errorResponse(res, 'Method not allowed', 405);
}
