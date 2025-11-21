import ImageKit from 'imagekit';
import axios from 'axios';
import * as fs from 'fs';

interface UploadResult {
  originalUrl: string;
  imagekitUrl: string;
  fileName: string;
  success: boolean;
  error?: string;
}

export class ImageKitUploader {
  private imagekit: ImageKit;

  constructor() {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error('ImageKit credentials not found in environment variables');
    }

    this.imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    console.log('✅ ImageKit initialized');
  }

  async uploadFromUrl(imageUrl: string, fileName: string, folder: string = 'menu-items'): Promise<UploadResult> {
    try {
      // Skip if no image URL
      if (!imageUrl || imageUrl === '') {
        return {
          originalUrl: imageUrl,
          imagekitUrl: '',
          fileName,
          success: false,
          error: 'No image URL provided',
        };
      }

      console.log(`📤 Uploading: ${fileName}`);

      // Download image first
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
      });

      const buffer = Buffer.from(response.data);

      // Upload to ImageKit
      const result = await this.imagekit.upload({
        file: buffer,
        fileName: fileName,
        folder: folder,
        useUniqueFileName: true,
        tags: ['menu', 'restaurant', 'food'],
      });

      console.log(`✅ Uploaded: ${fileName} -> ${result.url}`);

      return {
        originalUrl: imageUrl,
        imagekitUrl: result.url,
        fileName: result.name,
        success: true,
      };
    } catch (error) {
      console.error(`❌ Failed to upload ${fileName}:`, error);
      return {
        originalUrl: imageUrl,
        imagekitUrl: '',
        fileName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async uploadMultiple(images: { url: string; name: string }[], folder: string = 'menu-items'): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    console.log(`\n🚀 Uploading ${images.length} images to ImageKit...`);
    
    for (const img of images) {
      const result = await this.uploadFromUrl(img.url, img.name, folder);
      results.push(result);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const successful = results.filter(r => r.success).length;
    console.log(`\n✅ Upload complete: ${successful}/${images.length} successful`);

    return results;
  }
}

// Standalone execution for testing
if (require.main === module) {
  const uploader = new ImageKitUploader();
  
  // Read scraped data
  const scrapedData = JSON.parse(fs.readFileSync('scraped-data.json', 'utf-8'));
  
  const images = scrapedData.products
    .filter((p: any) => p.imageUrl)
    .map((p: any) => ({
      url: p.imageUrl,
      name: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`,
    }));

  uploader.uploadMultiple(images, 'desi-beats-menu')
    .then((results) => {
      fs.writeFileSync('imagekit-results.json', JSON.stringify(results, null, 2));
      console.log('💾 Results saved to imagekit-results.json');
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
