import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';
import * as fs from 'fs';

// Configure neon for WebSocket
neonConfig.webSocketConstructor = ws;

interface ScrapedProduct {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
}

interface ImageKitResult {
  originalUrl: string;
  imagekitUrl: string;
  fileName: string;
  success: boolean;
}

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment');
  }

  console.log('🔌 Connecting to database...');
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  // Read scraped data and ImageKit results
  console.log('📖 Reading scraped data...');
  const scrapedDataPath = 'scraped-data.json';
  const imagekitResultsPath = 'imagekit-results.json';

  if (!fs.existsSync(scrapedDataPath)) {
    throw new Error('scraped-data.json not found. Run scraper first.');
  }

  const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf-8'));
  
  // Load ImageKit results if available
  let imagekitResults: ImageKitResult[] = [];
  if (fs.existsSync(imagekitResultsPath)) {
    imagekitResults = JSON.parse(fs.readFileSync(imagekitResultsPath, 'utf-8'));
    console.log(`📸 Found ${imagekitResults.length} ImageKit upload results`);
  }

  // Create a map of original URL to ImageKit URL
  const imageMap = new Map<string, string>();
  imagekitResults.forEach(result => {
    if (result.success && result.imagekitUrl) {
      imageMap.set(result.originalUrl, result.imagekitUrl);
    }
  });

  console.log('\n🗑️  Clearing existing data...');
  await db.delete(schema.menuItems);
  await db.delete(schema.categories);

  console.log('📝 Creating categories...');
  const categoryMap = new Map<string, string>();
  const categories = Array.from(new Set(scrapedData.products.map((p: ScrapedProduct) => p.category)));
  
  let order = 1;
  for (const categoryName of categories) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const [category] = await db.insert(schema.categories)
      .values({
        name: categoryName,
        slug: slug,
        description: `${categoryName} items from Desi Beats Cafe`,
        order: order++,
        image: null,
      })
      .returning();
    
    categoryMap.set(categoryName, category.id);
    console.log(`  ✓ ${categoryName}`);
  }

  console.log('\n🍽️  Creating menu items...');
  let itemCount = 0;
  let itemOrder = 1;

  for (const product of scrapedData.products as ScrapedProduct[]) {
    const categoryId = categoryMap.get(product.category);
    
    if (!categoryId) {
      console.warn(`  ⚠️  Skipping ${product.name} - category not found`);
      continue;
    }

    // Get ImageKit URL if available, otherwise use original
    const imageUrl = imageMap.get(product.imageUrl) || product.imageUrl || null;

    await db.insert(schema.menuItems)
      .values({
        categoryId,
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: imageUrl,
        available: 1,
        featured: 0,
        order: itemOrder++,
      });

    itemCount++;
    console.log(`  ✓ ${product.name} (${product.category})`);
  }

  await pool.end();

  console.log('\n✅ Database seeding complete!');
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Menu Items: ${itemCount}`);
  console.log(`   Images from ImageKit: ${imageMap.size}`);
}

// Run the seeder
seedDatabase()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  });
