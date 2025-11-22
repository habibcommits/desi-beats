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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const db = await getDb();
    
    if (req.method === 'GET') {
      const item = await db.collection('menuitems').findOne({ _id: new ObjectId(id) });
      if (!item) return res.status(404).json({ error: 'Not found' });
      
      const formatted = {
        id: item._id.toString(),
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || null,
        price: item.price,
        image: item.image || null,
        available: Boolean(item.available),
        featured: Boolean(item.featured),
        order: item.order
      };
      
      return res.status(200).json(formatted);
    }
    
    if (req.method === 'PATCH') {
      const updates = req.body;
      await db.collection('menuitems').updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
      
      const updated = await db.collection('menuitems').findOne({ _id: new ObjectId(id) });
      if (!updated) {
        return res.status(404).json({ error: 'Menu item not found after update' });
      }
      
      return res.status(200).json({ 
        id: updated._id.toString(),
        ...updated 
      });
    }
    
    if (req.method === 'DELETE') {
      await db.collection('menuitems').deleteOne({ _id: new ObjectId(id) });
      return res.status(204).end();
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Menu item API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
