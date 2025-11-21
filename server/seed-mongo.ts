import mongoose from "mongoose";
import { CategoryModel, MenuItemModel } from "./models";
import { type InsertCategory, type InsertMenuItem } from "@shared/schema";

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGODB_URI environment variable is not set");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding");

    // Clear existing data
    await CategoryModel.deleteMany({});
    await MenuItemModel.deleteMany({});
    console.log("Cleared existing data");

    // Seed categories
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
    console.log(`Created ${categories.length} categories`);

    // Create slug-to-ID mapping
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
    const menuItems: InsertMenuItem[] = [
      // Breakfast
      { categoryId: getCategoryId("breakfast"), name: "Whole Wheat Paratha", price: 80, description: "Healthy whole wheat paratha", order: 1, available: true, featured: false, image: "/attached_assets/generated_images/chicken_paratha_breakfast_plate.png" },
      { categoryId: getCategoryId("breakfast"), name: "Allu Paratha", price: 150, description: "Potato stuffed paratha", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Allu Cheese Paratha", price: 220, description: "Potato and cheese paratha", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("breakfast"), name: "Chicken Paratha", price: 250, description: "Chicken stuffed paratha", order: 4, available: true, featured: true, image: "/attached_assets/generated_images/chicken_paratha_breakfast_plate.png" },
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
      { categoryId: getCategoryId("halwa-puri"), name: "Halwa Puri Nashta Deal", price: 450, description: "2 Puri + Plate Aloo + Cup Halwa", order: 6, available: true, featured: true, image: "/attached_assets/generated_images/halwa_puri_nashta_platter.png" },

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
      { categoryId: getCategoryId("karahi"), name: "Chicken Karahi Half", price: 1150, description: "Half portion chicken karahi", order: 1, available: true, featured: true, image: "/attached_assets/generated_images/chicken_karahi_in_pot.png" },
      { categoryId: getCategoryId("karahi"), name: "Chicken Karahi Full", price: 2250, description: "Full portion chicken karahi", order: 2, available: true, featured: true, image: "/attached_assets/generated_images/chicken_karahi_in_pot.png" },
      { categoryId: getCategoryId("karahi"), name: "Chicken Handi Half", price: 1490, description: "Half portion chicken handi", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Chicken Handi Full", price: 2790, description: "Full portion chicken handi", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Desi Murgh Karahi Half", price: 1900, description: "Half portion desi chicken karahi", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Desi Murgh Karahi Full", price: 3700, description: "Full portion desi chicken karahi", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Mutton Karahi Half", price: 1950, description: "Half portion mutton karahi", order: 7, available: true, featured: false },
      { categoryId: getCategoryId("karahi"), name: "Mutton Karahi Full", price: 3800, description: "Full portion mutton karahi", order: 8, available: true, featured: false },

      // Rice
      { categoryId: getCategoryId("rice"), name: "Daal Chawal", price: 490, description: "Lentils with rice", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Plain Rice", price: 300, description: "Steamed basmati rice", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Chicken Pulao", price: 480, description: "Chicken pulao rice", order: 3, available: true, featured: false, image: "/attached_assets/generated_images/chicken_biryani_bowl.png" },
      { categoryId: getCategoryId("rice"), name: "Chicken Bariyani", price: 590, description: "Spiced chicken biryani", order: 4, available: true, featured: true, image: "/attached_assets/generated_images/chicken_biryani_bowl.png" },
      { categoryId: getCategoryId("rice"), name: "Chicken Fried Rice", price: 690, description: "Fried rice with chicken", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("rice"), name: "Egg Fried Rice", price: 590, description: "Fried rice with egg", order: 6, available: true, featured: false },

      // Fish
      { categoryId: getCategoryId("fish"), name: "Fried Fish", price: 750, description: "Crispy fried fish", order: 1, available: true, featured: true },

      // BBQ
      { categoryId: getCategoryId("bbq"), name: "Chicken Tikka (6pc)", price: 590, description: "6 pieces chicken tikka", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Chicken Boti (6pc)", price: 590, description: "6 pieces chicken boti", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Malai Boti (6pc)", price: 620, description: "6 pieces malai boti", order: 3, available: true, featured: true },
      { categoryId: getCategoryId("bbq"), name: "Chicken Seekh Kabab", price: 180, description: "Single chicken seekh kabab", order: 4, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Beef Seekh Kabab", price: 150, description: "Single beef seekh kabab", order: 5, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "Chicken Behari Boti (6pc)", price: 620, description: "6 pieces behari boti", order: 6, available: true, featured: false },
      { categoryId: getCategoryId("bbq"), name: "BBQ Platter", price: 2400, description: "Mixed BBQ platter", order: 7, available: true, featured: true },

      // Burgers
      { categoryId: getCategoryId("burgers"), name: "Zinger Burger", price: 350, description: "Crispy chicken burger", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("burgers"), name: "Chicken Burger", price: 280, description: "Classic chicken burger", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("burgers"), name: "Beef Burger", price: 280, description: "Juicy beef burger", order: 3, available: true, featured: false },
      { categoryId: getCategoryId("burgers"), name: "Fish Burger", price: 380, description: "Fried fish burger", order: 4, available: true, featured: false },

      // Shawarma
      { categoryId: getCategoryId("shawarma"), name: "Chicken Shawarma", price: 280, description: "Chicken shawarma wrap", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("shawarma"), name: "Beef Shawarma", price: 300, description: "Beef shawarma wrap", order: 2, available: true, featured: false },

      // Roll Paratha
      { categoryId: getCategoryId("roll-paratha"), name: "Chicken Roll", price: 280, description: "Chicken paratha roll", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("roll-paratha"), name: "Beef Roll", price: 280, description: "Beef paratha roll", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("roll-paratha"), name: "Seekh Kabab Roll", price: 250, description: "Seekh kabab roll", order: 3, available: true, featured: false },

      // Fried Chicken
      { categoryId: getCategoryId("fried-chicken"), name: "Fried Chicken (1pc)", price: 200, description: "Single piece fried chicken", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("fried-chicken"), name: "Fried Chicken (2pc)", price: 380, description: "2 pieces fried chicken", order: 2, available: true, featured: true },
      { categoryId: getCategoryId("fried-chicken"), name: "Fried Chicken (4pc)", price: 750, description: "4 pieces fried chicken", order: 3, available: true, featured: false },

      // Hot Wings
      { categoryId: getCategoryId("hot-wings"), name: "Hot Wings (6pc)", price: 390, description: "6 pieces hot wings", order: 1, available: true, featured: true },
      { categoryId: getCategoryId("hot-wings"), name: "Hot Wings (12pc)", price: 750, description: "12 pieces hot wings", order: 2, available: true, featured: false },

      // Fries & Refreshments
      { categoryId: getCategoryId("fries"), name: "French Fries", price: 200, description: "Crispy french fries", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("fries"), name: "Masala Fries", price: 250, description: "Spiced masala fries", order: 2, available: true, featured: true },
      { categoryId: getCategoryId("fries"), name: "Loaded Fries", price: 350, description: "Loaded cheese fries", order: 3, available: true, featured: false },

      // Salad
      { categoryId: getCategoryId("salad"), name: "Kachumber Salad", price: 150, description: "Fresh mixed salad", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("salad"), name: "Green Salad", price: 150, description: "Fresh green salad", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("salad"), name: "Raita", price: 120, description: "Yogurt cucumber raita", order: 3, available: true, featured: false },

      // Tandoor
      { categoryId: getCategoryId("tandoor"), name: "Naan", price: 50, description: "Plain naan", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("tandoor"), name: "Garlic Naan", price: 80, description: "Garlic naan", order: 2, available: true, featured: true },
      { categoryId: getCategoryId("tandoor"), name: "Roti", price: 30, description: "Plain roti", order: 3, available: true, featured: false },

      // Drinks
      { categoryId: getCategoryId("drinks"), name: "Pepsi 1.5L", price: 180, description: "1.5L Pepsi bottle", order: 1, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "7UP 1.5L", price: 180, description: "1.5L 7UP bottle", order: 2, available: true, featured: false },
      { categoryId: getCategoryId("drinks"), name: "Fresh Lime", price: 150, description: "Fresh lime juice", order: 3, available: true, featured: true },
      { categoryId: getCategoryId("drinks"), name: "Lassi", price: 180, description: "Traditional yogurt drink", order: 4, available: true, featured: true },
    ];

    const items = await MenuItemModel.insertMany(menuItems);
    console.log(`Created ${items.length} menu items`);

    console.log("Database seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
