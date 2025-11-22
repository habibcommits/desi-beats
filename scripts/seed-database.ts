import mongoose from "mongoose";
import { CategoryModel, MenuItemModel } from "../server/models";
import type { InsertCategory, InsertMenuItem } from "@shared/schema";

const seedData = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGODB_URI environment variable is not set");
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB successfully');
    console.log('  → Database:', mongoose.connection.name);

    // Clear existing data
    console.log('\n⏳ Clearing existing data...');
    await Promise.all([
      CategoryModel.deleteMany({}),
      MenuItemModel.deleteMany({}),
    ]);
    console.log('✓ Cleared existing data');

    // Seed categories
    console.log('\n⏳ Seeding categories...');
    const categoryData: InsertCategory[] = [
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

    const categories = await CategoryModel.insertMany(categoryData);
    console.log(`✓ Seeded ${categories.length} categories`);

    // Create slug-to-ID mapping for menu items
    const categoryIdMap = new Map<string, string>();
    categories.forEach((cat) => {
      categoryIdMap.set(cat.slug, cat._id.toString());
    });

    const getCategoryId = (slug: string): string => {
      const id = categoryIdMap.get(slug);
      if (!id) {
        throw new Error(`Category slug "${slug}" not found during seeding`);
      }
      return id;
    };

    // Seed menu items
    console.log('\n⏳ Seeding menu items...');
    const menuItems: InsertMenuItem[] = [
      // Breakfast
      { categoryId: getCategoryId("breakfast"), name: "Whole Wheat Paratha", price: 80, description: "Healthy whole wheat paratha", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Allu Paratha", price: 150, description: "Potato stuffed paratha", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Allu Cheese Paratha", price: 220, description: "Potato and cheese paratha", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Chicken Paratha", price: 250, description: "Chicken stuffed paratha", order: 4, available: true, featured: true },
      { categoryId: getCategoryId("breakfast"), name: "Chicken Cheese Paratha", price: 300, description: "Chicken and cheese paratha", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Fry Egg", price: 80, description: "Fried egg", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Omelette", price: 90, description: "Classic omelette", order: 7, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Cheese Omelette", price: 150, description: "Cheese omelette", order: 8, available: true, featured: false },

      // Halwa Puri Nashta
      { categoryId: getCategoryId("halwa-puri"), name: "Puri", price: 70, description: "Single puri", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("halwa-puri"), name: "Halwa 250g", price: 220, description: "Sweet halwa 250g", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("halwa-puri"), name: "Aloo Bhujia", price: 250, description: "Spiced potato curry", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("halwa-puri"), name: "Chanay", price: 300, description: "Chickpea curry", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("halwa-puri"), name: "Desi Ghee Paratha", price: 180, description: "Paratha with pure desi ghee", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("halwa-puri"), name: "Halwa Puri Nashta Deal", price: 450, description: "2 Puri + Plate Aloo + Cup Halwa", order: 6, available: true, featured: true },

      // Main Course
      { categoryId: getCategoryId("main-course"), name: "Beef Nehari", price: 700, description: "Slow-cooked beef curry", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("main-course"), name: "Lahori Chanay", price: 300, description: "Lahore-style chickpeas", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("main-course"), name: "Special Daal", price: 350, description: "Mixed lentil curry", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("main-course"), name: "Special Sabzi", price: 350, description: "Mixed vegetable curry", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("main-course"), name: "Chicken Qorma", price: 450, description: "Creamy chicken curry", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("main-course"), name: "Chicken Haleem", price: 480, description: "Slow-cooked chicken & lentils", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("main-course"), name: "Chicken Qeema", price: 480, description: "Minced chicken curry", order: 7, available: true, featured: false },
      { categoryId: getCategoryId("main-course"), name: "Chicken Jalfarezi", price: 590, description: "Chicken with vegetables", order: 8, available: true, featured: false },
      { categoryId: getCategoryId("main-course"), name: "Chicken Madrasi", price: 950, description: "Spicy South Indian style chicken", order: 9, available: true, featured: false },

      // Karahi
      { categoryId: getCategoryId("karahi"), name: "Chicken Karahi Half", price: 1150, description: "Half portion chicken karahi", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("karahi"), name: "Chicken Karahi Full", price: 2250, description: "Full portion chicken karahi", order: 2, available: true, featured: true },
      { categoryId: getCategoryId("karahi"), name: "Chicken Handi Half", price: 1490, description: "Half portion chicken handi", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Chicken Handi Full", price: 2790, description: "Full portion chicken handi", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Desi Murgh Karahi Half", price: 1900, description: "Half portion desi chicken karahi", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Desi Murgh Karahi Full", price: 3700, description: "Full portion desi chicken karahi", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Mutton Karahi Half", price: 1950, description: "Half portion mutton karahi", order: 7, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Mutton Karahi Full", price: 3800, description: "Full portion mutton karahi", order: 8, available: true, featured: false },

      // Rice
      { categoryId: getCategoryId("rice"), name: "Daal Chawal", price: 490, description: "Lentils with rice", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Plain Rice", price: 300, description: "Steamed basmati rice", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Chicken Pulao", price: 480, description: "Chicken pulao rice", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Chicken Bariyani", price: 590, description: "Spiced chicken biryani", order: 4, available: true, featured: true },
      { categoryId: getCategoryId("rice"), name: "Chicken Fried Rice", price: 690, description: "Fried rice with chicken", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Egg Fried Rice", price: 590, description: "Fried rice with egg", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Plain Bariyani", price: 350, description: "Plain biryani rice", order: 7, available: true, featured: false },

      // Fish
      { categoryId: getCategoryId("fish"), name: "Rahu Grilled Fish 1kg", price: 1850, description: "Grilled rahu fish", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("fish"), name: "Rahu Fried Fish 1kg", price: 2000, description: "Fried rahu fish", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("fish"), name: "Finger Fried Fish 1kg", price: 2350, description: "Fish fingers fried", order: 3, available: true, featured: false },

      // BBQ
      { categoryId: getCategoryId("bbq"), name: "Chicken Tikka Boti", price: 200, description: "Chicken tikka pieces", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("bbq"), name: "Chicken Malia Boti", price: 400, description: "Creamy chicken boti", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Chicken Tikka Pice Leg", price: 370, description: "Chicken leg tikka", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Chicken Tikka Pice Chest", price: 380, description: "Chicken breast tikka", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Chicken Tikka Per Plate", price: 400, description: "Full plate chicken tikka", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Malai Boti 6 Seekh", price: 2400, description: "6 seekh malai boti", order: 6, available: true, featured: true },

      // Burgers
      { categoryId: getCategoryId("burgers"), name: "Zinger Burger with Fries", price: 350, description: "Crispy zinger burger with fries", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("burgers"), name: "Beef Smash Burger with Fries", price: 400, description: "Smashed beef burger with fries", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("burgers"), name: "Crispy Chicken Petty Burger with Fries", price: 350, description: "Chicken patty burger with fries", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("burgers"), name: "Anda Shami Burger", price: 220, description: "Egg and shami kabab burger", order: 4, available: true, featured: false },

      // Shawarma
      { categoryId: getCategoryId("shawarma"), name: "Chicken Shawarma", price: 220, description: "Chicken shawarma wrap", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("shawarma"), name: "Chicken Cheese Shawarma", price: 300, description: "Chicken shawarma with cheese", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("shawarma"), name: "Zinger Shawarma", price: 300, description: "Zinger shawarma wrap", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("shawarma"), name: "Shawarma Platter", price: 480, description: "Shawarma platter with sides", order: 4, available: true, featured: false },

      // Roll Paratha
      { categoryId: getCategoryId("roll-paratha"), name: "Garlic Mayo Roll", price: 350, description: "Garlic mayo chicken roll", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("roll-paratha"), name: "B.B.Q Pratha Roll", price: 400, description: "BBQ paratha roll", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("roll-paratha"), name: "Zinger Pratha Roll", price: 380, description: "Zinger paratha roll", order: 3, available: true, featured: false },

      // Fried Chicken
      { categoryId: getCategoryId("fried-chicken"), name: "Chicken Hot Shots", price: 450, description: "Spicy chicken shots (Half)", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("fried-chicken"), name: "Chicken Fried 2 Piece with Fries", price: 499, description: "2 piece fried chicken with fries", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("fried-chicken"), name: "Chicken Fried 6 Piece with Fries", price: 1250, description: "6 piece fried chicken with fries", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("fried-chicken"), name: "Nuggets 6 Pcs with Fries", price: 499, description: "6 chicken nuggets with fries", order: 4, available: true, featured: false },

      // Hot Wings
      { categoryId: getCategoryId("hot-wings"), name: "Masala Hot Wings 6 pcs", price: 650, description: "Spicy masala wings", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("hot-wings"), name: "Sesame Seed Hot Wings 6 pcs", price: 780, description: "Sesame coated wings", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("hot-wings"), name: "Garlic B.B.Q Wings 6 pce", price: 850, description: "Garlic BBQ wings", order: 3, available: true, featured: false },

      // Fries & Refreshments
      { categoryId: getCategoryId("fries"), name: "Plain Fries", price: 200, description: "Regular portion", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("fries"), name: "Masala Fries", price: 220, description: "Spiced fries", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("fries"), name: "Garlic Mayo Fries", price: 250, description: "Fries with garlic mayo", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("fries"), name: "Sesame Seed Fries", price: 250, description: "Fries with sesame", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("fries"), name: "Samosa Plate", price: 180, description: "Crispy samosas", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("fries"), name: "Pakoray 250g", price: 220, description: "Vegetable pakoras", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("fries"), name: "Chicken Pakoray 250g", price: 400, description: "Chicken pakoras", order: 7, available: true, featured: false },

      // Salad
      { categoryId: getCategoryId("salad"), name: "Green Salad", price: 100, description: "Fresh green salad", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("salad"), name: "Mint Raita", price: 120, description: "Yogurt with mint", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("salad"), name: "Mint Sauce", price: 140, description: "Mint chutney", order: 3, available: true, featured: false },

      // Tandoor
      { categoryId: getCategoryId("tandoor"), name: "Roti", price: 25, description: "Tandoori roti", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("tandoor"), name: "Naan", price: 30, description: "Tandoori naan", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("tandoor"), name: "Chapati", price: 70, description: "Soft chapati", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("tandoor"), name: "Tawa Paratha", price: 80, description: "Layered tawa paratha", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("tandoor"), name: "Roghni Naan", price: 70, description: "Buttery naan", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("tandoor"), name: "Tandoori Paratha", price: 70, description: "Tandoori paratha", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("tandoor"), name: "Kulcha", price: 50, description: "Stuffed kulcha", order: 7, available: true, featured: false },

      // Drinks
      { categoryId: getCategoryId("drinks"), name: "Mint Margarita", price: 350, description: "Fresh mint drink", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Lasi", price: 260, description: "Traditional yogurt drink", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Seasonal Shake", price: 450, description: "Seasonal fruit shake", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Cold Drink Can", price: 150, description: "Canned soft drink", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Cold Drink 1 Ltr.", price: 180, description: "1 liter soft drink", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Cold Drink 1.5 Ltr.", price: 250, description: "1.5 liter soft drink", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Mineral Water Large", price: 110, description: "Large water bottle", order: 7, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Mineral Water Small", price: 70, description: "Small water bottle", order: 8, available: true, featured: false },
    ];

    const items = await MenuItemModel.insertMany(menuItems);
    console.log(`✓ Seeded ${items.length} menu items`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  → ${categories.length} categories`);
    console.log(`  → ${items.length} menu items`);
    console.log(`\n📝 Note: Admin credentials should be set via environment variables:`);
    console.log(`  → ADMIN_USERNAME`);
    console.log(`  → ADMIN_PASSWORD`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
};

// Run the seed script
seedData()
  .then(() => {
    console.log('✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
