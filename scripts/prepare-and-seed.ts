import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';
import ImageKit from 'imagekit';
import axios from 'axios';
import * as fs from 'fs';

// Configure neon for WebSocket
neonConfig.webSocketConstructor = ws;

interface MenuItem {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  image?: string | null;
  available: number;
  featured: number;
  order: number;
}

interface Category {
  name: string;
  slug: string;
  description?: string | null;
  order: number;
  image?: string | null;
}

class DatabaseSeeder {
  private db: any;
  private pool: Pool;
  private imagekit: ImageKit;
  private categoryIdMap = new Map<string, string>();

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL not found');
    }

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error('ImageKit credentials not found');
    }

    this.pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(this.pool, { schema });

    this.imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    console.log('✅ Database and ImageKit initialized');
  }

  async uploadImage(localPath: string, fileName: string): Promise<string | null> {
    try {
      // Check if file exists in attached_assets
      const fullPath = localPath.startsWith('/') ? localPath.substring(1) : localPath;
      
      if (!fs.existsSync(fullPath)) {
        console.log(`  ⚠️  Image not found: ${fullPath}`);
        return null;
      }

      console.log(`  📤 Uploading: ${fileName}`);
      
      const buffer = fs.readFileSync(fullPath);
      
      const result = await this.imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: 'desi-beats-menu',
        useUniqueFileName: true,
        tags: ['menu', 'restaurant', 'desi-beats'],
      });

      console.log(`  ✅ Uploaded: ${result.url}`);
      return result.url;

    } catch (error) {
      console.error(`  ❌ Upload failed for ${fileName}:`, error);
      return null;
    }
  }

  async seedCategories() {
    console.log('\n📝 Creating categories...');

    const categories: Category[] = [
      { name: "Breakfast", slug: "breakfast", description: "Traditional Pakistani breakfast items", order: 1 },
      { name: "Halwa Puri Nashta", slug: "halwa-puri", description: "Authentic halwa puri breakfast specials", order: 2 },
      { name: "Main Course", slug: "main-course", description: "Traditional curries and gravies", order: 3 },
      { name: "Karahi", slug: "karahi", description: "Sizzling karahi specialties", order: 4 },
      { name: "Rice", slug: "rice", description: "Fragrant rice dishes and biryani", order: 5 },
      { name: "Fish", slug: "fish", description: "Fresh fish preparations", order: 6 },
      { name: "BBQ", slug: "bbq", description: "Grilled and barbecue specialties", order: 7 },
      { name: "Burgers", slug: "burgers", description: "Juicy burgers and sandwiches", order: 8 },
      { name: "Shawarma", slug: "shawarma", description: "Middle Eastern wraps", order: 9 },
      { name: "Roll Paratha", slug: "roll-paratha", description: "Rolled parathas with fillings", order: 10 },
      { name: "Fried Chicken", slug: "fried-chicken", description: "Crispy fried chicken", order: 11 },
      { name: "Hot Wings", slug: "hot-wings", description: "Spicy chicken wings", order: 12 },
      { name: "Fries & Refreshments", slug: "fries", description: "Sides and snacks", order: 13 },
      { name: "Salad", slug: "salad", description: "Fresh salads", order: 14 },
      { name: "Tandoor", slug: "tandoor", description: "Fresh tandoori breads", order: 15 },
      { name: "Drinks", slug: "drinks", description: "Beverages and refreshments", order: 16 },
    ];

    for (const cat of categories) {
      const [category] = await this.db.insert(schema.categories)
        .values({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          order: cat.order,
          image: cat.image || null,
        })
        .returning();
      
      this.categoryIdMap.set(cat.slug, category.id);
      console.log(`  ✓ ${cat.name}`);
    }
  }

  getCategoryId(slug: string): string {
    const id = this.categoryIdMap.get(slug);
    if (!id) throw new Error(`Category ${slug} not found`);
    return id;
  }

  async seedMenuItems() {
    console.log('\n🍽️  Creating menu items...');

    // Upload hero slider images first
    console.log('\n📸 Uploading hero slider images...');
    const halwaImageUrl = await this.uploadImage('attached_assets/halwa purri_1763745103812.jpg', 'halwa-puri-nashta.jpg');
    const karahiImageUrl = await this.uploadImage('attached_assets/Desi Murgh Karahi_1763744959845.jpg', 'desi-murgh-karahi.jpg');
    const bbqImageUrl = await this.uploadImage('attached_assets/assorted-meat-kebab-with-onions-herbs-grilled-vegetables_1763745270067.jpg', 'bbq-platter.jpg');

    const menuItems: MenuItem[] = [
      // Breakfast
      { categoryId: this.getCategoryId("breakfast"), name: "Whole Wheat Paratha", price: "80", description: "Healthy whole wheat paratha", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("breakfast"), name: "Allu Paratha", price: "150", description: "Potato stuffed paratha", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("breakfast"), name: "Allu Cheese Paratha", price: "220", description: "Potato and cheese paratha", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("breakfast"), name: "Chicken Paratha", price: "250", description: "Chicken stuffed paratha", order: 4, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("breakfast"), name: "Chicken Cheese Paratha", price: "300", description: "Chicken and cheese paratha", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("breakfast"), name: "Fry Egg", price: "80", description: "Fried egg", order: 6, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("breakfast"), name: "Omelette", price: "90", description: "Classic omelette", order: 7, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("breakfast"), name: "Cheese Omelette", price: "150", description: "Cheese omelette", order: 8, available: 1, featured: 0 },

      // Halwa Puri Nashta
      { categoryId: this.getCategoryId("halwa-puri"), name: "Puri", price: "70", description: "Single puri", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("halwa-puri"), name: "Halwa 250g", price: "220", description: "Sweet halwa 250g", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("halwa-puri"), name: "Aloo Bhujia", price: "250", description: "Spiced potato curry", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("halwa-puri"), name: "Chanay", price: "300", description: "Chickpea curry", order: 4, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("halwa-puri"), name: "Desi Ghee Paratha", price: "180", description: "Paratha with pure desi ghee", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("halwa-puri"), name: "Halwa Puri Nashta Deal", price: "450", description: "2 Puri + Plate Aloo + Cup Halwa", order: 6, available: 1, featured: 1, image: halwaImageUrl },

      // Main Course
      { categoryId: this.getCategoryId("main-course"), name: "Beef Nehari", price: "700", description: "Slow-cooked beef curry", order: 1, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("main-course"), name: "Lahori Chanay", price: "300", description: "Lahore-style chickpeas", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("main-course"), name: "Special Daal", price: "350", description: "Mixed lentil curry", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("main-course"), name: "Special Sabzi", price: "350", description: "Mixed vegetable curry", order: 4, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("main-course"), name: "Chicken Qorma", price: "450", description: "Creamy chicken curry", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("main-course"), name: "Chicken Haleem", price: "480", description: "Slow-cooked chicken & lentils", order: 6, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("main-course"), name: "Chicken Qeema", price: "480", description: "Minced chicken curry", order: 7, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("main-course"), name: "Chicken Jalfarezi", price: "590", description: "Chicken with vegetables", order: 8, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("main-course"), name: "Chicken Madrasi", price: "950", description: "Spicy South Indian style chicken", order: 9, available: 1, featured: 0 },

      // Karahi
      { categoryId: this.getCategoryId("karahi"), name: "Chicken Karahi Half", price: "1150", description: "Half portion chicken karahi", order: 1, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("karahi"), name: "Chicken Karahi Full", price: "2250", description: "Full portion chicken karahi", order: 2, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("karahi"), name: "Chicken Handi Half", price: "1490", description: "Half portion chicken handi", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("karahi"), name: "Chicken Handi Full", price: "2790", description: "Full portion chicken handi", order: 4, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("karahi"), name: "Desi Murgh Karahi Half", price: "1900", description: "Half portion desi chicken karahi", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("karahi"), name: "Desi Murgh Karahi Full", price: "3700", description: "Full portion desi chicken karahi", order: 6, available: 1, featured: 1, image: karahiImageUrl },
      { categoryId: this.getCategoryId("karahi"), name: "Mutton Karahi Half", price: "1950", description: "Half portion mutton karahi", order: 7, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("karahi"), name: "Mutton Karahi Full", price: "3800", description: "Full portion mutton karahi", order: 8, available: 1, featured: 0 },

      // Rice
      { categoryId: this.getCategoryId("rice"), name: "Daal Chawal", price: "490", description: "Lentils with rice", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("rice"), name: "Plain Rice", price: "300", description: "Steamed basmati rice", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("rice"), name: "Chicken Pulao", price: "480", description: "Chicken pulao rice", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("rice"), name: "Chicken Bariyani", price: "590", description: "Spiced chicken biryani", order: 4, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("rice"), name: "Chicken Fried Rice", price: "690", description: "Fried rice with chicken", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("rice"), name: "Egg Fried Rice", price: "590", description: "Fried rice with egg", order: 6, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("rice"), name: "Plain Bariyani", price: "350", description: "Plain biryani rice", order: 7, available: 1, featured: 0 },

      // Fish
      { categoryId: this.getCategoryId("fish"), name: "Rahu Grilled Fish 1kg", price: "1850", description: "Grilled rahu fish", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fish"), name: "Rahu Fried Fish 1kg", price: "2000", description: "Fried rahu fish", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fish"), name: "Finger Fried Fish 1kg", price: "2350", description: "Fish fingers fried", order: 3, available: 1, featured: 0 },

      // BBQ
      { categoryId: this.getCategoryId("bbq"), name: "Chicken Tikka Boti", price: "200", description: "Chicken tikka pieces", order: 1, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("bbq"), name: "Chicken Malia Boti", price: "400", description: "Creamy chicken boti", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("bbq"), name: "Chicken Tikka Pice Leg", price: "370", description: "Chicken leg tikka", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("bbq"), name: "Chicken Tikka Pice Chest", price: "380", description: "Chicken breast tikka", order: 4, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("bbq"), name: "Chicken Tikka Per Plate", price: "400", description: "Full plate chicken tikka", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("bbq"), name: "Family BBQ Platter", price: "2400", description: "Malai Boti 6 Seekh + Naan + Raita", order: 6, available: 1, featured: 1, image: bbqImageUrl },

      // Burgers
      { categoryId: this.getCategoryId("burgers"), name: "Zinger Burger with Fries", price: "350", description: "Crispy zinger burger with fries", order: 1, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("burgers"), name: "Beef Smash Burger with Fries", price: "400", description: "Smashed beef burger with fries", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("burgers"), name: "Crispy Chicken Petty Burger with Fries", price: "350", description: "Chicken patty burger with fries", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("burgers"), name: "Anda Shami Burger", price: "220", description: "Egg and shami kabab burger", order: 4, available: 1, featured: 0 },

      // Shawarma
      { categoryId: this.getCategoryId("shawarma"), name: "Chicken Shawarma", price: "220", description: "Chicken shawarma wrap", order: 1, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("shawarma"), name: "Chicken Cheese Shawarma", price: "300", description: "Chicken shawarma with cheese", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("shawarma"), name: "Zinger Shawarma", price: "300", description: "Zinger shawarma wrap", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("shawarma"), name: "Shawarma Platter", price: "480", description: "Shawarma platter with sides", order: 4, available: 1, featured: 0 },

      // Roll Paratha
      { categoryId: this.getCategoryId("roll-paratha"), name: "Garlic Mayo Roll", price: "350", description: "Garlic mayo chicken roll", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("roll-paratha"), name: "B.B.Q Pratha Roll", price: "400", description: "BBQ paratha roll", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("roll-paratha"), name: "Zinger Pratha Roll", price: "380", description: "Zinger paratha roll", order: 3, available: 1, featured: 0 },

      // Fried Chicken
      { categoryId: this.getCategoryId("fried-chicken"), name: "Chicken Hot Shots", price: "450", description: "Spicy chicken shots (Half)", order: 1, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("fried-chicken"), name: "Chicken Fried 2 Piece with Fries", price: "499", description: "2 piece fried chicken with fries", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fried-chicken"), name: "Chicken Fried 6 Piece with Fries", price: "1250", description: "6 piece fried chicken with fries", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fried-chicken"), name: "Nuggets 6 Pcs with Fries", price: "499", description: "6 chicken nuggets with fries", order: 4, available: 1, featured: 0 },

      // Hot Wings
      { categoryId: this.getCategoryId("hot-wings"), name: "Masala Hot Wings 6 pcs", price: "650", description: "Spicy masala wings", order: 1, available: 1, featured: 1 },
      { categoryId: this.getCategoryId("hot-wings"), name: "Sesame Seed Hot Wings 6 pcs", price: "780", description: "Sesame coated wings", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("hot-wings"), name: "Garlic B.B.Q Wings 6 pce", price: "850", description: "Garlic BBQ wings", order: 3, available: 1, featured: 0 },

      // Fries & Refreshments
      { categoryId: this.getCategoryId("fries"), name: "Plain Fries", price: "200", description: "Regular portion", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fries"), name: "Masala Fries", price: "220", description: "Spiced fries", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fries"), name: "Garlic Mayo Fries", price: "250", description: "Fries with garlic mayo", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fries"), name: "Sesame Seed Fries", price: "250", description: "Fries with sesame", order: 4, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fries"), name: "Samosa Plate", price: "180", description: "Crispy samosas", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fries"), name: "Pakoray 250g", price: "220", description: "Vegetable pakoras", order: 6, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("fries"), name: "Chicken Pakoray 250g", price: "400", description: "Chicken pakoras", order: 7, available: 1, featured: 0 },

      // Salad
      { categoryId: this.getCategoryId("salad"), name: "Green Salad", price: "100", description: "Fresh green salad", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("salad"), name: "Mint Raita", price: "120", description: "Yogurt with mint", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("salad"), name: "Mint Sauce", price: "140", description: "Mint chutney", order: 3, available: 1, featured: 0 },

      // Tandoor
      { categoryId: this.getCategoryId("tandoor"), name: "Roti", price: "25", description: "Tandoori roti", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("tandoor"), name: "Naan", price: "30", description: "Tandoori naan", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("tandoor"), name: "Chapati", price: "70", description: "Soft chapati", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("tandoor"), name: "Tawa Paratha", price: "80", description: "Layered tawa paratha", order: 4, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("tandoor"), name: "Roghni Naan", price: "70", description: "Buttery naan", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("tandoor"), name: "Tandoori Paratha", price: "70", description: "Tandoori paratha", order: 6, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("tandoor"), name: "Kulcha", price: "50", description: "Stuffed kulcha", order: 7, available: 1, featured: 0 },

      // Drinks
      { categoryId: this.getCategoryId("drinks"), name: "Mint Margarita", price: "350", description: "Fresh mint drink", order: 1, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("drinks"), name: "Lasi", price: "260", description: "Traditional yogurt drink", order: 2, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("drinks"), name: "Seasonal Shake", price: "450", description: "Seasonal fruit shake", order: 3, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("drinks"), name: "Cold Drink Can", price: "150", description: "Canned soft drink", order: 4, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("drinks"), name: "Cold Drink 1 Ltr.", price: "180", description: "1 liter soft drink", order: 5, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("drinks"), name: "Cold Drink 1.5 Ltr.", price: "250", description: "1.5 liter soft drink", order: 6, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("drinks"), name: "Mineral Water Large", price: "110", description: "Large water bottle", order: 7, available: 1, featured: 0 },
      { categoryId: this.getCategoryId("drinks"), name: "Mineral Water Small", price: "70", description: "Small water bottle", order: 8, available: 1, featured: 0 },
    ];

    let count = 0;
    for (const item of menuItems) {
      await this.db.insert(schema.menuItems).values({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: item.image || null,
        available: item.available,
        featured: item.featured,
        order: item.order,
      });
      count++;
      console.log(`  ✓ ${item.name}`);
    }

    console.log(`\n✅ Created ${count} menu items`);
  }

  async run() {
    try {
      console.log('🗑️  Clearing existing data...');
      await this.db.delete(schema.menuItems);
      await this.db.delete(schema.categories);

      await this.seedCategories();
      await this.seedMenuItems();

      await this.pool.end();

      console.log('\n🎉 Database seeding complete!');
    } catch (error) {
      console.error('\n❌ Error:', error);
      await this.pool.end();
      process.exit(1);
    }
  }
}

const seeder = new DatabaseSeeder();
seeder.run();
