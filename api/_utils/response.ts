import type { VercelResponse } from '@vercel/node';

export function successResponse(res: VercelResponse, data: any, status = 200) {
  return res.status(status).json(data);
}

export function errorResponse(res: VercelResponse, message: string, status = 500) {
  return res.status(status).json({ error: message });
}

export function notFoundResponse(res: VercelResponse, message = 'Resource not found') {
  return res.status(404).json({ error: message });
}

export function badRequestResponse(res: VercelResponse, message: string, details?: any) {
  return res.status(400).json({ error: message, details });
}
