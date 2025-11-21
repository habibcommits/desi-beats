import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface ScrapedProduct {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
}

interface ScrapedData {
  restaurantName: string;
  categories: string[];
  products: ScrapedProduct[];
}

async function scrapeFoodPanda(url: string): Promise<ScrapedData> {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();
  
  // Set a realistic viewport and user agent
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  console.log('📄 Navigating to FoodPanda...');
  await page.goto(url, { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });

  // Wait for the page to load
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Scroll down to load all products
  console.log('📜 Scrolling to load all products...');
  await autoScroll(page);

  console.log('🔍 Extracting page content...');
  const html = await page.content();
  const $ = cheerio.load(html);

  const products: ScrapedProduct[] = [];
  const categoriesSet = new Set<string>();
  let restaurantName = 'Desi Beats Cafe';

  // Try to extract restaurant name
  const nameElement = $('h1').first().text().trim();
  if (nameElement) {
    restaurantName = nameElement;
  }

  console.log(`🏪 Restaurant: ${restaurantName}`);

  // Extract products - FoodPanda uses various selectors
  // We'll try multiple approaches
  
  // Approach 1: Look for product cards
  $('[data-testid*="product"], [data-testid*="item"], .dish-card, .product-card').each((i, elem) => {
    const $elem = $(elem);
    
    const name = $elem.find('h3, h4, .dish-name, [class*="name"]').first().text().trim();
    const description = $elem.find('p, .dish-description, [class*="description"]').first().text().trim();
    const priceText = $elem.find('[class*="price"], .price').first().text().trim();
    const imageUrl = $elem.find('img').first().attr('src') || '';
    
    // Try to find category from parent sections
    let category = 'Uncategorized';
    const categoryElem = $elem.closest('section, div[data-testid*="category"]').find('h2, h3').first().text().trim();
    if (categoryElem) {
      category = categoryElem;
    }

    if (name && priceText) {
      // Clean price - extract numbers
      const price = priceText.replace(/[^\d.]/g, '');
      
      if (price) {
        products.push({
          name,
          description: description || '',
          price,
          imageUrl: imageUrl || '',
          category,
        });
        categoriesSet.add(category);
      }
    }
  });

  // Approach 2: Look for menu items in different structure
  if (products.length === 0) {
    $('article, .menu-item, [class*="MenuItem"]').each((i, elem) => {
      const $elem = $(elem);
      
      const name = $elem.find('[class*="Name"], [class*="title"]').first().text().trim();
      const description = $elem.find('[class*="Description"]').first().text().trim();
      const priceText = $elem.find('[class*="Price"]').first().text().trim();
      const imageUrl = $elem.find('img').first().attr('src') || '';
      
      let category = 'Uncategorized';
      const sectionHeader = $elem.closest('section').prev('h2, h3').text().trim();
      if (sectionHeader) {
        category = sectionHeader;
      }

      if (name && priceText) {
        const price = priceText.replace(/[^\d.]/g, '');
        if (price) {
          products.push({
            name,
            description: description || '',
            price,
            imageUrl: imageUrl || '',
            category,
          });
          categoriesSet.add(category);
        }
      }
    });
  }

  await browser.close();

  console.log(`✅ Scraped ${products.length} products from ${categoriesSet.size} categories`);

  return {
    restaurantName,
    categories: Array.from(categoriesSet),
    products,
  };
}

async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// Main execution
const url = process.argv[2] || 'https://www.foodpanda.pk/restaurant/w7hs/desi-beats-cafe';

scrapeFoodPanda(url)
  .then((data) => {
    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'scraped-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`\n💾 Data saved to: ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Restaurant: ${data.restaurantName}`);
    console.log(`   Categories: ${data.categories.length}`);
    console.log(`   Products: ${data.products.length}`);
  })
  .catch((error) => {
    console.error('❌ Error scraping FoodPanda:', error);
    process.exit(1);
  });
