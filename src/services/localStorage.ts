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
    name: 'Elektronik',
    slug: 'elektronik',
    description: 'Produk elektronik seperti smartphone, laptop, dan gadget lainnya',
    icon: '',
    product_count: 25,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Pakaian, sepatu, dan aksesoris fashion untuk pria dan wanita',
    icon: '',
    product_count: 18,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    _id: '3',
    name: 'Olahraga',
    slug: 'olahraga',
    description: 'Peralatan olahraga dan aktivitas fisik',
    icon: '',
    product_count: 12,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  {
    _id: '4',
    name: 'Rumah Tangga',
    slug: 'rumah-tangga',
    description: 'Peralatan dan perlengkapan rumah tangga',
    icon: '',
    product_count: 15,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    _id: '5',
    name: 'Kecantikan',
    slug: 'kecantikan',
    description: 'Produk kecantikan dan perawatan tubuh',
    icon: '',
    product_count: 8,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z'
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    _id: '1',
    name: 'Smartphone Samsung Galaxy S23',
    slug: 'smartphone-samsung-galaxy-s23',
    description: 'Smartphone flagship dengan kamera canggih',
    price: 12000000,
    original_price: 15000000,
    category: DEFAULT_CATEGORIES[0],
    is_featured: true,
    stock: 50,
    images: [{ _id: '1', url: '', alt_text: 'Samsung Galaxy S23', is_primary: true }],
    specifications: { 'RAM': '8GB', 'Storage': '256GB', 'Display': '6.1 inch' },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Laptop ASUS ROG Strix',
    slug: 'laptop-asus-rog-strix',
    description: 'Laptop gaming dengan performa tinggi',
    price: 18000000,
    category: DEFAULT_CATEGORIES[0],
    is_featured: false,
    stock: 25,
    images: [{ _id: '2', url: '', alt_text: 'ASUS ROG Strix', is_primary: true }],
    specifications: { 'CPU': 'Intel i7', 'RAM': '16GB', 'GPU': 'RTX 3060' },
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    _id: '3',
    name: 'Sepatu Nike Air Max',
    slug: 'sepatu-nike-air-max',
    description: 'Sepatu olahraga dengan teknologi Air Max',
    price: 1500000,
    original_price: 2000000,
    category: DEFAULT_CATEGORIES[2],
    is_featured: true,
    stock: 100,
    images: [{ _id: '3', url: '', alt_text: 'Nike Air Max', is_primary: true }],
    specifications: { 'Size': '42', 'Material': 'Synthetic', 'Color': 'Black/White' },
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  }
];

const DEFAULT_PROMOS: Promo[] = [
  {
    _id: '1',
    title: 'Flash Sale Elektronik',
    description: 'Diskon hingga 50% untuk semua produk elektronik',
    discount_percentage: 30,
    max_discount: 2000000,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    applicable_categories: [DEFAULT_CATEGORIES[0]],
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
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