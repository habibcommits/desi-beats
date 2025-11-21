import XLSX from 'xlsx';
import ImageKit from 'imagekit';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CategoryModel, MenuItemModel } from '../server/models';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

interface ProductRow {
  category: string;
  productName: string;
  price: string;
  description: string;
}

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  const match = priceStr.match(/Rs\.\s*(\d+)/);
  return match ? parseFloat(match[1]) : 0;
}

function normalizeImageName(productName: string): string {
  return productName.toLowerCase().trim();
}

async function uploadImageToImageKit(imagePath: string, fileName: string): Promise<string | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      console.log(`Image not found: ${imagePath}`);
      return null;
    }

    const result = await imagekit.upload({
      file: fs.createReadStream(imagePath),
      fileName: fileName,
      folder: '/products',
      useUniqueFileName: true,
    });

    console.log(`✓ Uploaded: ${fileName} -> ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`✗ Failed to upload ${fileName}:`, error);
    return null;
  }
}

function findMatchingImage(productName: string, imagesDir: string): string | null {
  const normalizedName = normalizeImageName(productName);
  const imageFiles = fs.readdirSync(imagesDir);

  for (const file of imageFiles) {
    const normalizedFile = normalizeImageName(path.parse(file).name);
    if (normalizedFile === normalizedName) {
      return path.join(imagesDir, file);
    }
  }

  return null;
}

async function main() {
  try {
    console.log('🚀 Starting product upload process...\n');

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');

    console.log('📖 Reading Excel file...');
    const excelPath = path.join(process.cwd(), 'attached_assets/foodpanda_products_1763751592478.xlsx');
    const workbook = XLSX.readFile(excelPath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: ['category', 'productName', 'price', 'description'] });

    const products: ProductRow[] = rawData.slice(1) as ProductRow[];
    console.log(`✓ Found ${products.length} products\n`);

    const imagesDir = path.join(process.cwd(), 'product_images');
    const categoryMap = new Map<string, { id: string; itemCount: number }>();
    let categoryOrder = 1;

    console.log('📁 Clearing existing data...\n');
    await MenuItemModel.deleteMany({});
    await CategoryModel.deleteMany({});
    console.log('✓ Cleared existing categories and menu items\n');

    console.log('📁 Processing categories and products...\n');

    for (const product of products) {
      if (!product.category || !product.productName) continue;

      let categoryData = categoryMap.get(product.category);

      if (!categoryData) {
        let slug = product.category
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const existingWithSlug = await CategoryModel.findOne({ slug });
        if (existingWithSlug) {
          slug = `${slug}-${categoryOrder}`;
        }

        const category = await CategoryModel.create({
          name: product.category,
          slug,
          description: null,
          image: null,
          order: categoryOrder++,
        });
        console.log(`✓ Created category: ${product.category}`);

        categoryData = { id: category._id.toString(), itemCount: 0 };
        categoryMap.set(product.category, categoryData);
      }

      const categoryId = categoryData.id;

      let imageUrl: string | null = null;
      const imagePath = findMatchingImage(product.productName, imagesDir);

      if (imagePath) {
        imageUrl = await uploadImageToImageKit(
          imagePath,
          `${product.productName}.${path.extname(imagePath).slice(1)}`
        );
      } else {
        console.log(`⊘ No image found for: ${product.productName}`);
      }

      const price = parsePrice(product.price);
      const itemOrder = categoryData.itemCount++;

      await MenuItemModel.create({
        categoryId,
        name: product.productName,
        description: product.description || null,
        price,
        image: imageUrl,
        available: true,
        featured: false,
        order: itemOrder,
      });

      console.log(`✓ Created product: ${product.productName} (Rs. ${price}) [order: ${itemOrder}]`);
    }

    console.log('\n🎉 Upload complete!');
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
