import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../_utils/cors';
import { successResponse, errorResponse } from '../_utils/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    const defaultConfig = {
      slides: [
        {
          id: 1,
          title: "Halwa Puri Nashta Deal",
          description: "2 Puri + 1 Plate Aloo + 1 Cup Halwa",
          price: "450",
          bgGradient: "from-amber-600/90 to-orange-800/90",
          imageUrl: "/halwa_puri_nashta_platter.png",
        },
        {
          id: 2,
          title: "Family BBQ Platter",
          description: "Malai Boti 6 Seekh + Naan + Raita",
          price: "2400",
          bgGradient: "from-red-700/90 to-red-900/90",
          imageUrl: "/bbq_chicken_tikka_skewers.png",
        },
        {
          id: 3,
          title: "Desi Murgh Karahi",
          description: "Full Karahi with 4 Naan",
          price: "3700",
          bgGradient: "from-orange-600/90 to-amber-800/90",
          imageUrl: "/chicken_karahi_in_pot.png",
        },
      ],
    };

    return successResponse(res, defaultConfig);
  } catch (error) {
    console.error('[API] Failed to fetch hero slider data:', error);
    return errorResponse(res, 'Failed to fetch hero slider data');
  }
}
