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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDb();
    const categories = await db.collection('categories')
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    const formatted = categories.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description || null,
      image: doc.image || null,
      order: doc.order
    }));
    
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
