import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function getDb() {
  if (!mongoUri) throw new Error('MONGO_URI not configured');
  const client = await MongoClient.connect(mongoUri);
  return client.db();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDb();
    
    if (req.method === 'GET') {
      const menuItems = await db.collection('menuitems')
        .find({})
        .sort({ order: 1 })
        .toArray();
      
      const formatted = menuItems.map(doc => ({
        id: doc._id.toString(),
        categoryId: doc.categoryId,
        name: doc.name,
        description: doc.description || null,
        price: doc.price,
        image: doc.image || null,
        available: Boolean(doc.available),
        featured: Boolean(doc.featured),
        order: doc.order
      }));
      
      return res.status(200).json(formatted);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Menu items API error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}
