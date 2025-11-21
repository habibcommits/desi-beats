import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse, badRequestResponse } from '../_utils/response';
import { getStorage } from '../_utils/storage';
import { insertOrderSchema } from '../../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const storage = await getStorage();

  if (req.method === 'GET') {
    try {
      const orders = await storage.getOrders();
      return successResponse(res, orders);
    } catch (error) {
      console.error('[API] Failed to fetch orders:', error);
      return errorResponse(res, 'Failed to fetch orders');
    }
  }

  if (req.method === 'POST') {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      return successResponse(res, order, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return badRequestResponse(res, 'Invalid order data', error.errors);
      }
      console.error('[API] Failed to create order:', error);
      return errorResponse(res, 'Failed to create order');
    }
  }

  return errorResponse(res, 'Method not allowed', 405);
}
