import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse } from '../_utils/response';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return errorResponse(res, 'Method not allowed', 405);
  }

  try {
    const loginSchema = z.object({
      username: z.string().min(1, "Username is required"),
      password: z.string().min(1, "Password is required"),
    });
    
    const { username, password } = loginSchema.parse(req.body);
    
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";
    
    if (username === adminUsername && password === adminPassword) {
      return successResponse(res, { success: true, message: "Logged in successfully" });
    } else {
      return errorResponse(res, "Invalid credentials", 401);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, "Invalid input", 400);
    }
    console.error('[API] Login failed:', error);
    return errorResponse(res, "Login failed", 500);
  }
}
