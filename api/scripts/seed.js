import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for ESM import issue
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models directly
import AdminUser from '../models/AdminUser.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import ProductImage from '../models/ProductImage.js';
import Promo from '../models/Promo.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-katalog');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      ProductImage.deleteMany({}),
      Promo.deleteMany({}),
      AdminUser.deleteMany({})
    ]);

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await AdminUser.create({
      username: 'admin',
      email: 'admin@ekatalog.com',
      password_hash: hashedPassword,
      name: 'Administrator',
      role: 'super_admin',
      is_active: true
    });
    console.log('Admin user created:', adminUser.username);

    // Create categories
    console.log('Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Elektronik',
        slug: 'elektronik',
        description: 'Produk elektronik terbaru dan terpercaya',
        icon: 'smartphone',
        is_active: true
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Koleksi fashion terkini untuk pria dan wanita',
        icon: 'shirt',
        is_active: true
      },
      {
        name: 'Olahraga',
        slug: 'olahraga',
        description: 'Peralatan olahraga dan fitness berkualitas',
        icon: 'dumbbell',
        is_active: true
      },
      {
        name: 'Rumah Tangga',
        slug: 'rumah-tangga',
        description: 'Peralatan rumah tangga dan dekorasi',
        icon: 'home',
        is_active: true
      },
      {
        name: 'Kecantikan',
        slug: 'kecantikan',
        description: 'Produk kecantikan dan perawatan tubuh',
        icon: 'sparkles',
        is_active: true
      }
    ]);
    console.log(`Created ${categories.length} categories`);

    // Create products
    console.log('Creating products...');
    const elektronikCategory = categories.find(c => c.slug === 'elektronik');
    const fashionCategory = categories.find(c => c.slug === 'fashion');
    const olahragaCategory = categories.find(c => c.slug === 'olahraga');
    const rumahTanggaCategory = categories.find(c => c.slug === 'rumah-tangga');
    const kecantikanCategory = categories.find(c => c.slug === 'kecantikan');

    const products = await Product.insertMany([
      // Elektronik
      {
        name: 'Smartphone Android Flagship Premium',
        slug: 'smartphone-android-flagship-premium',
        description: 'Smartphone flagship dengan performa tinggi, kamera canggih, dan desain premium. Dilengkapi dengan prosesor terbaru dan RAM besar untuk pengalaman multitasking yang lancar.',
        price: 8500000,
        original_price: 10000000,
        category: elektronikCategory._id,
        specifications: {
          'Layar': '6.7 inch AMOLED',
          'Prosesor': 'Snapdragon 8 Gen 2',
          'RAM': '12GB',
          'Storage': '256GB',
          'Kamera': '108MP Triple Camera',
          'Baterai': '5000mAh',
          'OS': 'Android 13'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Wireless Earbuds Pro Max',
        slug: 'wireless-earbuds-pro-max',
        description: 'Earbuds wireless premium dengan noise cancellation aktif dan kualitas suara Hi-Fi. Cocok untuk musik, gaming, dan panggilan.',
        price: 1200000,
        original_price: 1500000,
        category: elektronikCategory._id,
        specifications: {
          'Driver': '10mm Dynamic',
          'Bluetooth': '5.3',
          'Battery Life': '8 jam + 24 jam case',
          'Noise Cancellation': 'Active ANC',
          'Water Resistance': 'IPX5',
          'Charging': 'USB-C + Wireless'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Gaming Laptop RTX 4070',
        slug: 'gaming-laptop-rtx-4070',
        description: 'Laptop gaming powerful dengan GPU RTX 4070 untuk gaming dan content creation. Layar high refresh rate dan cooling system canggih.',
        price: 22000000,
        original_price: 25000000,
        category: elektronikCategory._id,
        specifications: {
          'Prosesor': 'Intel Core i7-13700H',
          'GPU': 'NVIDIA RTX 4070 8GB',
          'RAM': '16GB DDR5',
          'Storage': '1TB NVMe SSD',
          'Layar': '15.6" 165Hz QHD',
          'Keyboard': 'RGB Mechanical',
          'Cooling': 'Dual Fan + Liquid Metal'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Smartwatch Health Monitor Pro',
        slug: 'smartwatch-health-monitor-pro',
        description: 'Smartwatch dengan fitur monitoring kesehatan lengkap, GPS, dan tahan air. Cocok untuk aktivitas sehari-hari dan olahraga.',
        price: 1640000,
        original_price: 2000000,
        category: elektronikCategory._id,
        specifications: {
          'Display': '1.4" AMOLED Always-On',
          'Health Sensors': 'Heart Rate, SpO2, Sleep',
          'GPS': 'Built-in GPS + GLONASS',
          'Water Resistance': '5ATM + IP68',
          'Battery': '7 hari normal use',
          'Connectivity': 'Bluetooth 5.0, WiFi'
        },
        is_featured: false,
        is_active: true
      },

      // Fashion
      {
        name: 'Jaket Denim Premium Unisex',
        slug: 'jaket-denim-premium-unisex',
        description: 'Jaket denim berkualitas tinggi dengan desain timeless. Cocok untuk pria dan wanita, tersedia dalam berbagai ukuran.',
        price: 450000,
        original_price: 600000,
        category: fashionCategory._id,
        specifications: {
          'Material': '100% Cotton Denim',
          'Weight': '14oz Heavy Denim',
          'Fit': 'Regular Fit',
          'Sizes': 'S, M, L, XL, XXL',
          'Color': 'Dark Blue, Light Blue',
          'Care': 'Machine Wash Cold'
        },
        is_featured: false,
        is_active: true
      },
      {
        name: 'Tas Ransel Laptop Waterproof',
        slug: 'tas-ransel-laptop-waterproof',
        description: 'Tas ransel multifungsi dengan kompartemen laptop hingga 17 inch. Anti air dan dilengkapi dengan port USB charging.',
        price: 320000,
        original_price: 400000,
        category: fashionCategory._id,
        specifications: {
          'Capacity': '35L',
          'Laptop Compartment': 'Up to 17 inch',
          'Material': 'Oxford 1680D Waterproof',
          'Features': 'USB Charging Port, Anti-theft',
          'Dimensions': '45 x 32 x 20 cm',
          'Weight': '1.2 kg'
        },
        is_featured: false,
        is_active: true
      },

      // Olahraga
      {
        name: 'Sepatu Running Professional',
        slug: 'sepatu-running-professional',
        description: 'Sepatu lari profesional dengan teknologi cushioning terdepan. Ringan, breathable, dan tahan lama untuk performa maksimal.',
        price: 750000,
        original_price: 1000000,
        category: olahragaCategory._id,
        specifications: {
          'Upper Material': 'Engineered Mesh',
          'Midsole': 'EVA + Air Cushion',
          'Outsole': 'Carbon Rubber',
          'Weight': '280g (Size 42)',
          'Drop': '8mm',
          'Sizes': '39-46'
        },
        is_featured: true,
        is_active: true
      },
      {
        name: 'Dumbbell Set Adjustable 20kg',
        slug: 'dumbbell-set-adjustable-20kg',
        description: 'Set dumbbell adjustable dengan berat total 20kg. Cocok untuk home gym dan latihan strength training.',
        price: 850000,
        original_price: 1100000,
        category: olahragaCategory._id,
        specifications: {
          'Total Weight': '20kg (2 x 10kg)',
          'Adjustable Range': '2.5kg - 10kg per dumbbell',
          'Material': 'Cast Iron + Rubber Coating',
          'Handle': 'Knurled Steel Grip',
          'Plates': '4 x 2.5kg, 4 x 1.25kg',
          'Connector': 'Threaded Lock System'
        },
        is_featured: false,
        is_active: true
      },

      // Rumah Tangga
      {
        name: 'Rice Cooker Digital 1.8L',
        slug: 'rice-cooker-digital-18l',
        description: 'Rice cooker digital dengan berbagai menu masak otomatis. Kapasitas 1.8L cocok untuk keluarga 4-6 orang.',
        price: 680000,
        original_price: 850000,
        category: rumahTanggaCategory._id,
        specifications: {
          'Capacity': '1.8L (10 cups)',
          'Power': '860W',
          'Functions': '8 Cooking Modes',
          'Timer': '24-hour delay timer',
          'Keep Warm': 'Auto keep warm',
          'Inner Pot': 'Non-stick coating'
        },
        is_featured: false,
        is_active: true
      },

      // Kecantikan
      {
        name: 'Skincare Set Anti Aging Premium',
        slug: 'skincare-set-anti-aging-premium',
        description: 'Set perawatan kulit anti aging lengkap dengan serum, moisturizer, dan sunscreen. Cocok untuk semua jenis kulit.',
        price: 420000,
        original_price: 550000,
        category: kecantikanCategory._id,
        specifications: {
          'Set Contents': 'Cleanser, Toner, Serum, Moisturizer, Sunscreen',
          'Key Ingredients': 'Retinol, Hyaluronic Acid, Vitamin C',
          'Skin Type': 'All skin types',
          'Volume': '50ml each product',
          'Usage': 'Morning & Night routine',
          'Benefits': 'Anti-aging, Hydrating, Brightening'
        },
        is_featured: false,
        is_active: true
      }
    ]);
    console.log(`Created ${products.length} products`);

    // Create product images
    console.log('Creating product images...');
    const productImages = [];
    
    for (const product of products) {
      // Create main image
      const mainImage = {
        product: product._id,
        url: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '%20') + '%20product%20photography')}&image_size=square`,
        alt_text: product.name,
        is_primary: true
      };
      productImages.push(mainImage);

      // Create additional images
      for (let i = 2; i <= 3; i++) {
        const additionalImage = {
          product: product._id,
          url: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '%20') + '%20angle%20' + i + '%20product%20photography')}&image_size=square`,
          alt_text: `${product.name} - View ${i}`,
          is_primary: false
        };
        productImages.push(additionalImage);
      }
    }

    await ProductImage.insertMany(productImages);
    console.log(`Created ${productImages.length} product images`);

    // Create promos
    console.log('Creating promos...');
    const promoProducts = products.filter(p => p.original_price && p.original_price > p.price);
    const promos = [];

    for (const product of promoProducts) {
      const discountPercentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      const promo = {
        name: `Promo ${product.name}`,
        discount_percentage: discountPercentage,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        is_active: true,
        product: product._id
      };
      promos.push(promo);
    }

    await Promo.insertMany(promos);
    console.log(`Created ${promos.length} promos`);

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`✅ Admin Users: 1`);
    console.log(`✅ Categories: ${categories.length}`);
    console.log(`✅ Products: ${products.length}`);
    console.log(`✅ Product Images: ${productImages.length}`);
    console.log(`✅ Promos: ${promos.length}`);
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nSeeding completed successfully!');

  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};

// Run seeding
const runSeed = async () => {
  try {
    await connectDB();
    await seedData();
    process.exit(0);
  } catch (error) {
    console.error('Seed script failed:', error);
    process.exit(1);
  }
};

// Check if script is run directly
if (import.meta.url === import.meta.resolve('./seed.js')) {
  runSeed();
}

export { seedData, connectDB };