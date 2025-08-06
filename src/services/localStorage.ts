// Local storage service for managing persistent data
import { Product, Category, Promo } from './api';

// Storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'sistabagg_categories',
  PRODUCTS: 'sistabagg_products',
  PROMOS: 'sistabagg_promos',
  WISHLIST: 'sistabagg_wishlist'
};

// Default mock data
const DEFAULT_CATEGORIES: Category[] = [
  {
    _id: '1',
    name: 'Tote Bag',
    slug: 'tote-bag',
    description: 'Tas tote yang praktis dan stylish untuk berbagai kebutuhan',
    icon: '',
    product_count: 25,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Sling Bag / Crossbody Bag',
    slug: 'sling-bag-crossbody-bag',
    description: 'Tas selempang yang nyaman untuk aktivitas sehari-hari',
    icon: '',
    product_count: 30,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    _id: '3',
    name: 'Backpack / Tas Ransel Dewasa',
    slug: 'backpack-tas-ransel-dewasa',
    description: 'Tas ransel berkualitas untuk dewasa dengan desain modern',
    icon: '',
    product_count: 35,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  {
    _id: '4',
    name: 'Shoulder Bag',
    slug: 'shoulder-bag',
    description: 'Tas bahu yang elegan dan fungsional',
    icon: '',
    product_count: 28,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    _id: '5',
    name: 'Waist Bag / Tas Pinggang',
    slug: 'waist-bag-tas-pinggang',
    description: 'Tas pinggang praktis untuk aktivitas outdoor dan travel',
    icon: '',
    product_count: 20,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z'
  },
  {
    _id: '6',
    name: 'Travel Bag / Duffel Bag',
    slug: 'travel-bag-duffel-bag',
    description: 'Tas travel yang spacious untuk perjalanan jauh',
    icon: '',
    product_count: 18,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    _id: '7',
    name: 'Tas Selempang Kerja',
    slug: 'tas-selempang-kerja',
    description: 'Tas selempang profesional untuk kebutuhan kerja',
    icon: '',
    product_count: 22,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z'
  },
  {
    _id: '8',
    name: 'Tas Laptop / Office Bag',
    slug: 'tas-laptop-office-bag',
    description: 'Tas laptop dan office bag untuk profesional',
    icon: '',
    product_count: 32,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z'
  },
  {
    _id: '9',
    name: 'Tas Kabin / Carry-on Bag',
    slug: 'tas-kabin-carry-on-bag',
    description: 'Tas kabin yang sesuai standar maskapai untuk perjalanan',
    icon: '',
    product_count: 15,
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z'
  },
  {
    _id: '10',
    name: 'Tas Organizer',
    slug: 'tas-organizer',
    description: 'Tas organizer untuk menyimpan barang dengan rapi',
    icon: '',
    product_count: 12,
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z'
  },
  {
    _id: '11',
    name: 'Tas Sekolah Anak',
    slug: 'tas-sekolah-anak',
    description: 'Tas sekolah yang nyaman dan tahan lama untuk anak-anak',
    icon: '',
    product_count: 25,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  // Tote Bag
  {
    _id: '1',
    name: 'Tote Bag Canvas Premium',
    slug: 'tote-bag-canvas-premium',
    description: 'Tote bag canvas berkualitas tinggi dengan desain minimalis dan elegan',
    price: 185000,
    original_price: 220000,
    category: DEFAULT_CATEGORIES[0], // Tote Bag
    is_featured: true,
    stock: 45,
    images: [{ _id: '1', url: '', alt_text: 'Tote Bag Canvas Premium', is_primary: true }],
    specifications: { 'Material': 'Canvas Premium', 'Ukuran': '40x35x12 cm', 'Berat': '450g', 'Handle': 'Kulit Sintetis' },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  // Sling Bag / Crossbody Bag
  {
    _id: '2',
    name: 'Crossbody Bag Leather Style',
    slug: 'crossbody-bag-leather-style',
    description: 'Tas selempang dengan tampilan kulit yang stylish untuk aktivitas sehari-hari',
    price: 165000,
    category: DEFAULT_CATEGORIES[1], // Sling Bag / Crossbody Bag
    is_featured: true,
    stock: 38,
    images: [{ _id: '2', url: '', alt_text: 'Crossbody Bag Leather Style', is_primary: true }],
    specifications: { 'Material': 'PU Leather', 'Ukuran': '25x18x8 cm', 'Berat': '320g', 'Tali': 'Adjustable' },
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  // Backpack / Tas Ransel Dewasa
  {
    _id: '3',
    name: 'Backpack Urban Professional',
    slug: 'backpack-urban-professional',
    description: 'Tas ransel modern dengan kompartemen laptop untuk profesional muda',
    price: 285000,
    original_price: 350000,
    category: DEFAULT_CATEGORIES[2], // Backpack / Tas Ransel Dewasa
    is_featured: true,
    stock: 32,
    images: [{ _id: '3', url: '', alt_text: 'Backpack Urban Professional', is_primary: true }],
    specifications: { 'Material': 'Nylon Waterproof', 'Ukuran': '45x32x18 cm', 'Berat': '750g', 'Laptop': '15.6 inch' },
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  // Shoulder Bag
  {
    _id: '4',
    name: 'Shoulder Bag Elegant',
    slug: 'shoulder-bag-elegant',
    description: 'Tas bahu elegan dengan desain timeless untuk berbagai acara',
    price: 225000,
    category: DEFAULT_CATEGORIES[3], // Shoulder Bag
    is_featured: false,
    stock: 28,
    images: [{ _id: '4', url: '', alt_text: 'Shoulder Bag Elegant', is_primary: true }],
    specifications: { 'Material': 'Synthetic Leather', 'Ukuran': '30x25x10 cm', 'Berat': '480g', 'Closure': 'Magnetic' },
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  // Waist Bag / Tas Pinggang
  {
    _id: '5',
    name: 'Waist Bag Outdoor Adventure',
    slug: 'waist-bag-outdoor-adventure',
    description: 'Tas pinggang tahan air untuk aktivitas outdoor dan traveling',
    price: 125000,
    original_price: 155000,
    category: DEFAULT_CATEGORIES[4], // Waist Bag / Tas Pinggang
    is_featured: true,
    stock: 55,
    images: [{ _id: '5', url: '', alt_text: 'Waist Bag Outdoor Adventure', is_primary: true }],
    specifications: { 'Material': 'Ripstop Nylon', 'Ukuran': '25x15x8 cm', 'Berat': '180g', 'Waterproof': 'Yes' },
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z'
  },
  // Travel Bag / Duffel Bag
  {
    _id: '6',
    name: 'Travel Duffel Bag Large',
    slug: 'travel-duffel-bag-large',
    description: 'Tas travel berkapasitas besar dengan roda untuk perjalanan jauh',
    price: 385000,
    original_price: 450000,
    category: DEFAULT_CATEGORIES[5], // Travel Bag / Duffel Bag
    is_featured: true,
    stock: 22,
    images: [{ _id: '6', url: '', alt_text: 'Travel Duffel Bag Large', is_primary: true }],
    specifications: { 'Material': 'Polyester Heavy Duty', 'Ukuran': '65x35x30 cm', 'Berat': '1.2kg', 'Wheels': 'Yes' },
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  // Tas Selempang Kerja
  {
    _id: '7',
    name: 'Messenger Bag Professional',
    slug: 'messenger-bag-professional',
    description: 'Tas selempang profesional untuk keperluan kerja dengan kompartemen laptop',
    price: 265000,
    category: DEFAULT_CATEGORIES[6], // Tas Selempang Kerja
    is_featured: true,
    stock: 35,
    images: [{ _id: '7', url: '', alt_text: 'Messenger Bag Professional', is_primary: true }],
    specifications: { 'Material': 'Canvas Waterproof', 'Ukuran': '38x28x12 cm', 'Laptop': '14 inch', 'Pockets': '6' },
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z'
  },
  // Tas Laptop / Office Bag
  {
    _id: '8',
    name: 'Laptop Office Bag Executive',
    slug: 'laptop-office-bag-executive',
    description: 'Tas laptop executive dengan desain formal untuk profesional',
    price: 425000,
    original_price: 550000,
    category: DEFAULT_CATEGORIES[7], // Tas Laptop / Office Bag
    is_featured: true,
    stock: 18,
    images: [{ _id: '8', url: '', alt_text: 'Laptop Office Bag Executive', is_primary: true }],
    specifications: { 'Material': 'Genuine Leather', 'Ukuran': '42x30x8 cm', 'Laptop': '15.6 inch', 'Compartments': '5' },
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z'
  },
  // Tas Kabin / Carry-on Bag
  {
    _id: '9',
    name: 'Cabin Bag Airline Approved',
    slug: 'cabin-bag-airline-approved',
    description: 'Tas kabin yang memenuhi standar maskapai dengan roda dan handle telescopic',
    price: 485000,
    category: DEFAULT_CATEGORIES[8], // Tas Kabin / Carry-on Bag
    is_featured: false,
    stock: 15,
    images: [{ _id: '9', url: '', alt_text: 'Cabin Bag Airline Approved', is_primary: true }],
    specifications: { 'Material': 'ABS Hard Shell', 'Ukuran': '55x35x20 cm', 'Weight': '2.8kg', 'TSA Lock': 'Yes' },
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z'
  },
  // Tas Organizer
  {
    _id: '10',
    name: 'Multi Compartment Organizer',
    slug: 'multi-compartment-organizer',
    description: 'Tas organizer dengan banyak kompartemen untuk menyimpan barang dengan rapi',
    price: 145000,
    original_price: 185000,
    category: DEFAULT_CATEGORIES[9], // Tas Organizer
    is_featured: true,
    stock: 40,
    images: [{ _id: '10', url: '', alt_text: 'Multi Compartment Organizer', is_primary: true }],
    specifications: { 'Material': 'Nylon Ripstop', 'Ukuran': '30x20x15 cm', 'Compartments': '12', 'Zippers': 'YKK' },
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z'
  },
  // Tas Sekolah Anak
  {
    _id: '11',
    name: 'Kids School Backpack Colorful',
    slug: 'kids-school-backpack-colorful',
    description: 'Tas sekolah anak dengan desain colorful dan kompartemen yang aman',
    price: 125000,
    category: DEFAULT_CATEGORIES[10], // Tas Sekolah Anak
    is_featured: false,
    stock: 60,
    images: [{ _id: '11', url: '', alt_text: 'Kids School Backpack Colorful', is_primary: true }],
    specifications: { 'Material': 'Polyester Safe', 'Ukuran': '35x25x12 cm', 'Weight': '350g', 'Reflective': 'Yes' },
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    _id: '12',
    name: 'Premium Tote Bag Leather',
    slug: 'premium-tote-bag-leather',
    description: 'Tote bag kulit premium dengan kualitas terbaik untuk gaya elegan',
    price: 650000,
    original_price: 780000,
    category: DEFAULT_CATEGORIES[0], // Tote Bag
    is_featured: true,
    stock: 12,
    images: [{ _id: '12', url: '', alt_text: 'Premium Tote Bag Leather', is_primary: true }],
    specifications: { 'Material': 'Genuine Leather', 'Ukuran': '42x38x15 cm', 'Weight': '650g', 'Hardware': 'Gold' },
    created_at: '2024-01-04T10:00:00Z',
    updated_at: '2024-01-04T10:00:00Z'
  }
];

const DEFAULT_PROMOS: Promo[] = [
  {
    _id: '1',
    title: 'Flash Sale Tas Sekolah Anak',
    description: 'Diskon hingga 25% untuk semua tas sekolah anak dengan kualitas terbaik',
    discount_percentage: 25,
    max_discount: 50000,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    applicable_categories: [DEFAULT_CATEGORIES[10]], // Tas Sekolah Anak
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Promo Office & Professional Bags',
    description: 'Diskon spesial untuk tas laptop, office bag, dan tas selempang kerja',
    discount_percentage: 20,
    max_discount: 100000,
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-06-30T23:59:59Z',
    applicable_categories: [DEFAULT_CATEGORIES[6], DEFAULT_CATEGORIES[7]], // Tas Selempang Kerja, Tas Laptop / Office Bag
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '3',
    title: 'Weekend Sale Tote & Crossbody',
    description: 'Diskon weekend untuk tote bag dan crossbody bag stylish',
    discount_percentage: 15,
    max_discount: 75000,
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-05-31T23:59:59Z',
    applicable_categories: [DEFAULT_CATEGORIES[0], DEFAULT_CATEGORIES[1]], // Tote Bag, Sling Bag / Crossbody Bag
    is_active: true,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  }
];

// Utility functions
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Storage service
export class LocalStorageService {
  // Initialize storage with default data if empty
  static initializeStorage(): void {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROMOS)) {
      localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(DEFAULT_PROMOS));
    }
  }

  // Categories
  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Error loading categories from localStorage:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  static saveCategory(categoryData: Partial<Category>): Category {
    const categories = this.getCategories();
    const now = new Date().toISOString();
    
    const newCategory: Category = {
      _id: generateId(),
      name: categoryData.name || '',
      slug: generateSlug(categoryData.name || ''),
      description: categoryData.description || '',
      icon: categoryData.icon || '',
      product_count: 0,
      created_at: now,
      updated_at: now
    };

    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return newCategory;
  }

  static updateCategory(id: string, categoryData: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat._id === id);
    
    if (index === -1) return null;

    const updatedCategory = {
      ...categories[index],
      ...categoryData,
      updated_at: new Date().toISOString()
    };

    categories[index] = updatedCategory;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return updatedCategory;
  }

  static deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(cat => cat._id !== id);
    
    if (filteredCategories.length === categories.length) return false;

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filteredCategories));
    return true;
  }

  // Products
  static getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return DEFAULT_PRODUCTS;
    }
  }

  static saveProduct(productData: Partial<Product>): Product {
    const products = this.getProducts();
    const categories = this.getCategories();
    const now = new Date().toISOString();
    
    // Find category
    const category = categories.find(cat => cat._id === productData.category?._id);
    
    const newProduct: Product = {
      _id: generateId(),
      name: productData.name || '',
      slug: generateSlug(productData.name || ''),
      description: productData.description || '',
      price: productData.price || 0,
      original_price: productData.original_price,
      main_image_url: productData.main_image_url,
      category: category || categories[0],
      is_featured: productData.is_featured || false,
      stock: productData.stock || 0,
      images: productData.images || [],
      specifications: productData.specifications || {},
      created_at: now,
      updated_at: now
    };

    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    
    // Update category product count
    if (category) {
      this.updateCategoryProductCount(category._id);
    }
    
    return newProduct;
  }

  static updateProduct(id: string, productData: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(prod => prod._id === id);
    
    if (index === -1) return null;

    const updatedProduct = {
      ...products[index],
      ...productData,
      updated_at: new Date().toISOString()
    };

    products[index] = updatedProduct;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return updatedProduct;
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const product = products.find(prod => prod._id === id);
    const filteredProducts = products.filter(prod => prod._id !== id);
    
    if (filteredProducts.length === products.length) return false;

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filteredProducts));
    
    // Update category product count
    if (product?.category) {
      this.updateCategoryProductCount(product.category._id);
    }
    
    return true;
  }

  // Update category product count
  static updateCategoryProductCount(categoryId: string): void {
    const categories = this.getCategories();
    const products = this.getProducts();
    
    const categoryIndex = categories.findIndex(cat => cat._id === categoryId);
    if (categoryIndex === -1) return;

    const productCount = products.filter(prod => prod.category._id === categoryId).length;
    categories[categoryIndex].product_count = productCount;
    
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // Promos
  static getPromos(): Promo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROMOS);
      return data ? JSON.parse(data) : DEFAULT_PROMOS;
    } catch (error) {
      console.error('Error loading promos from localStorage:', error);
      return DEFAULT_PROMOS;
    }
  }

  static savePromo(promoData: Partial<Promo>): Promo {
    const promos = this.getPromos();
    const now = new Date().toISOString();
    
    const newPromo: Promo = {
      _id: generateId(),
      title: promoData.title || '',
      description: promoData.description || '',
      discount_percentage: promoData.discount_percentage || 0,
      max_discount: promoData.max_discount || 0,
      start_date: promoData.start_date || now,
      end_date: promoData.end_date || now,
      applicable_categories: promoData.applicable_categories || [],
      is_active: promoData.is_active || false,
      image: promoData.image,
      created_at: now,
      updated_at: now
    };

    promos.push(newPromo);
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promos));
    return newPromo;
  }

  static updatePromo(id: string, promoData: Partial<Promo>): Promo | null {
    const promos = this.getPromos();
    const index = promos.findIndex(promo => promo._id === id);
    
    if (index === -1) return null;

    const updatedPromo = {
      ...promos[index],
      ...promoData,
      updated_at: new Date().toISOString()
    };

    promos[index] = updatedPromo;
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promos));
    return updatedPromo;
  }

  static deletePromo(id: string): boolean {
    const promos = this.getPromos();
    const filteredPromos = promos.filter(promo => promo._id !== id);
    
    if (filteredPromos.length === promos.length) return false;

    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(filteredPromos));
    return true;
  }

  // Clear all data
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.PROMOS);
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
  }

  // Wishlist methods
  static getWishlist(): string[] {
    try {
      const wishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  }

  static addToWishlist(productId: string): boolean {
    try {
      const wishlist = this.getWishlist();
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  }

  static removeFromWishlist(productId: string): boolean {
    try {
      const wishlist = this.getWishlist();
      const index = wishlist.indexOf(productId);
      if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  }

  static isInWishlist(productId: string): boolean {
    const wishlist = this.getWishlist();
    return wishlist.includes(productId);
  }

  static toggleWishlist(productId: string): boolean {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
      return false;
    } else {
      this.addToWishlist(productId);
      return true;
    }
  }

  // Featured product methods
  static toggleProductFeatured(productId: string): boolean {
    try {
      const products = this.getProducts();
      const productIndex = products.findIndex(p => p._id === productId);
      
      if (productIndex > -1) {
        products[productIndex].is_featured = !products[productIndex].is_featured;
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return products[productIndex].is_featured;
      }
      return false;
    } catch (error) {
      console.error('Error toggling product featured status:', error);
      return false;
    }
  }
}

// Initialize storage on module load
LocalStorageService.initializeStorage();

export default LocalStorageService;