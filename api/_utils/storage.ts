import { MemStorage, type IStorage } from '../../server/storage';
import { MongoStorage } from '../../server/mongo-storage';

let storageInstance: IStorage | undefined;

export async function getStorage(): Promise<IStorage> {
  if (storageInstance) {
    return storageInstance;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (mongoUri) {
    console.log('[Storage] Initializing MongoDB storage for serverless');
    storageInstance = new MongoStorage();
  } else {
    console.log('[Storage] Using in-memory storage (development only - data will not persist)');
    storageInstance = new MemStorage();
  }

  return storageInstance;
}
