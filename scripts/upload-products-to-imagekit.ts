import * as XLSX from 'xlsx';
import ImageKit from 'imagekit';
import * as fs from 'fs';
import * as path from 'path';
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

function parsePrice(priceStr: string): string {
  if (!priceStr) return '0';
  const match = priceStr.match(/Rs\.\s*(\d+)/);
  return match ? match[1] : '0';
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
    const workbook = XLSX.readFile('attached_assets/foodpanda_products_1763751592478.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: ['category', 'productName', 'price', 'description'] });

    const products: ProductRow[] = rawData.slice(1) as ProductRow[];
    console.log(`✓ Found ${products.length} products\n`);

    const imagesDir = 'product_images';
    const categoryMap = new Map<string, string>();
    let categoryOrder = 1;

    console.log('📁 Processing categories and products...\n');

    for (const product of products) {
      if (!product.category || !product.productName) continue;

      let categoryId = categoryMap.get(product.category);

      if (!categoryId) {
        const slug = product.category
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        let category = await CategoryModel.findOne({ slug });

        if (!category) {
          category = await CategoryModel.create({
            name: product.category,
            slug,
            description: null,
            image: null,
            order: categoryOrder++,
          });
          console.log(`✓ Created category: ${product.category}`);
        }

        categoryId = category._id.toString();
        categoryMap.set(product.category, categoryId);
      }

      const existingItem = await MenuItemModel.findOne({
        name: product.productName,
        categoryId,
      });

      if (existingItem) {
        console.log(`⊘ Skipping duplicate: ${product.productName}`);
        continue;
      }

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

      await MenuItemModel.create({
        categoryId,
        name: product.productName,
        description: product.description || null,
        price,
        image: imageUrl,
        available: true,
        featured: false,
        order: 0,
      });

      console.log(`✓ Created product: ${product.productName} (Rs. ${price})`);
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
