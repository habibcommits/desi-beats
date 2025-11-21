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
    
    if (req.method === 'GET') {
      const orders = await db.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      const formatted = orders.map(doc => ({
        id: doc._id.toString(),
        ...doc,
        _id: undefined
      }));
      
      return res.status(200).json(formatted);
    }
    
    if (req.method === 'POST') {
      const orderData = {
        ...req.body,
        createdAt: new Date(),
        status: req.body.status || 'pending'
      };
      
      const result = await db.collection('orders').insertOne(orderData);
      return res.status(201).json({ 
        id: result.insertedId.toString(),
        ...orderData 
      });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Orders API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
