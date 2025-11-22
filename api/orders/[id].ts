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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
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
    
    if (req.method === 'PATCH') {
      const updates = req.body;
      await db.collection('orders').updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
      
      const updated = await db.collection('orders').findOne({ _id: new ObjectId(id) });
      if (!updated) {
        return res.status(404).json({ error: 'Order not found after update' });
      }
      
      return res.status(200).json({ 
        id: updated._id.toString(),
        ...updated 
      });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Order API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
