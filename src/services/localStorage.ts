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
  // Kategori Utama: Anak-anak
  {
    _id: '1',
    name: 'Tas Sekolah Anak',
    slug: 'tas-sekolah-anak',
    description: 'Tas sekolah yang nyaman dan tahan lama untuk anak-anak',
    icon: '',
    product_count: 15,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Tas Ransel Karakter',
    slug: 'tas-ransel-karakter',
    description: 'Tas ransel dengan karakter favorit anak-anak',
    icon: '',
    product_count: 20,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    _id: '3',
    name: 'Tas Selempang Anak',
    slug: 'tas-selempang-anak',
    description: 'Tas selempang praktis untuk aktivitas anak',
    icon: '',
    product_count: 12,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  {
    _id: '4',
    name: 'Tas Makan Anak',
    slug: 'tas-makan-anak',
    description: 'Lunch bag dan tas makan untuk anak sekolah',
    icon: '',
    product_count: 18,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    _id: '5',
    name: 'Tas Serut Anak',
    slug: 'tas-serut-anak',
    description: 'Drawstring bag untuk olahraga dan aktivitas anak',
    icon: '',
    product_count: 10,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z'
  },
  {
    _id: '6',
    name: 'Tas Mainan Anak',
    slug: 'tas-mainan-anak',
    description: 'Tas khusus untuk menyimpan mainan anak',
    icon: '',
    product_count: 8,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  // Kategori Utama: Remaja
  {
    _id: '7',
    name: 'Tas Ransel Remaja',
    slug: 'tas-ransel-remaja',
    description: 'Tas ransel stylish untuk remaja',
    icon: '',
    product_count: 25,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z'
  },
  {
    _id: '8',
    name: 'Tas Selempang Remaja',
    slug: 'tas-selempang-remaja',
    description: 'Tas selempang trendy untuk remaja aktif',
    icon: '',
    product_count: 22,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z'
  },
  {
    _id: '9',
    name: 'Tote Bag Remaja',
    slug: 'tote-bag-remaja',
    description: 'Tote bag casual untuk remaja',
    icon: '',
    product_count: 18,
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z'
  },
  {
    _id: '10',
    name: 'Sling Bag Remaja',
    slug: 'sling-bag-remaja',
    description: 'Sling bag compact untuk remaja',
    icon: '',
    product_count: 15,
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z'
  },
  {
    _id: '11',
    name: 'Tas Laptop Ringan',
    slug: 'tas-laptop-ringan',
    description: 'Tas laptop ringan untuk remaja dan mahasiswa',
    icon: '',
    product_count: 12,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    _id: '12',
    name: 'Tas Travel Remaja',
    slug: 'tas-travel-remaja',
    description: 'Tas travel untuk liburan remaja',
    icon: '',
    product_count: 10,
    created_at: '2024-01-04T10:00:00Z',
    updated_at: '2024-01-04T10:00:00Z'
  },
  // Kategori Utama: Dewasa
  {
    _id: '13',
    name: 'Tote Bag',
    slug: 'tote-bag',
    description: 'Tote bag elegan untuk dewasa',
    icon: '',
    product_count: 30,
    created_at: '2024-01-03T10:00:00Z',
    updated_at: '2024-01-03T10:00:00Z'
  },
  {
    _id: '14',
    name: 'Sling Bag Dewasa',
    slug: 'sling-bag-dewasa',
    description: 'Crossbody bag untuk aktivitas sehari-hari',
    icon: '',
    product_count: 25,
    created_at: '2024-01-02T10:00:00Z',
    updated_at: '2024-01-02T10:00:00Z'
  },
  {
    _id: '15',
    name: 'Backpack Dewasa',
    slug: 'backpack-dewasa',
    description: 'Tas ransel untuk dewasa dan profesional',
    icon: '',
    product_count: 28,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    _id: '16',
    name: 'Shoulder Bag',
    slug: 'shoulder-bag',
    description: 'Tas bahu untuk gaya kasual dan formal',
    icon: '',
    product_count: 20,
    created_at: '2023-12-31T10:00:00Z',
    updated_at: '2023-12-31T10:00:00Z'
  },
  {
    _id: '17',
    name: 'Waist Bag',
    slug: 'waist-bag',
    description: 'Tas pinggang praktis untuk aktivitas outdoor',
    icon: '',
    product_count: 15,
    created_at: '2023-12-30T10:00:00Z',
    updated_at: '2023-12-30T10:00:00Z'
  },
  {
    _id: '18',
    name: 'Travel Bag',
    slug: 'travel-bag',
    description: 'Duffel bag untuk perjalanan jauh',
    icon: '',
    product_count: 18,
    created_at: '2023-12-29T10:00:00Z',
    updated_at: '2023-12-29T10:00:00Z'
  },
  {
    _id: '19',
    name: 'Tas Selempang Kerja',
    slug: 'tas-selempang-kerja',
    description: 'Tas selempang untuk keperluan kantor',
    icon: '',
    product_count: 22,
    created_at: '2023-12-28T10:00:00Z',
    updated_at: '2023-12-28T10:00:00Z'
  },
  {
    _id: '20',
    name: 'Tas Laptop Office',
    slug: 'tas-laptop-office',
    description: 'Office bag dengan kompartemen laptop',
    icon: '',
    product_count: 25,
    created_at: '2023-12-27T10:00:00Z',
    updated_at: '2023-12-27T10:00:00Z'
  },
  {
    _id: '21',
    name: 'Tas Kabin',
    slug: 'tas-kabin',
    description: 'Carry-on bag untuk perjalanan pesawat',
    icon: '',
    product_count: 12,
    created_at: '2023-12-26T10:00:00Z',
    updated_at: '2023-12-26T10:00:00Z'
  },
  {
    _id: '22',
    name: 'Tas Organizer',
    slug: 'tas-organizer',
    description: 'Tas dengan banyak kompartemen untuk organisasi',
    icon: '',
    product_count: 16,
    created_at: '2023-12-25T10:00:00Z',
    updated_at: '2023-12-25T10:00:00Z'
  },
  // Kategori Utama: Berdasarkan Fungsi
  {
    _id: '23',
    name: 'Tas Sekolah',
    slug: 'tas-sekolah',
    description: 'Tas untuk keperluan sekolah semua usia',
    icon: '',
    product_count: 35,
    created_at: '2023-12-24T10:00:00Z',
    updated_at: '2023-12-24T10:00:00Z'
  },
  {
    _id: '24',
    name: 'Tas Kantor',
    slug: 'tas-kantor',
    description: 'Tas profesional untuk keperluan kantor',
    icon: '',
    product_count: 28,
    created_at: '2023-12-23T10:00:00Z',
    updated_at: '2023-12-23T10:00:00Z'
  },
  {
    _id: '25',
    name: 'Tas Belanja',
    slug: 'tas-belanja',
    description: 'Shopping bag untuk berbelanja sehari-hari',
    icon: '',
    product_count: 20,
    created_at: '2023-12-22T10:00:00Z',
    updated_at: '2023-12-22T10:00:00Z'
  },
  {
    _id: '26',
    name: 'Tas Makeup',
    slug: 'tas-makeup',
    description: 'Tas kosmetik untuk peralatan makeup',
    icon: '',
    product_count: 18,
    created_at: '2023-12-21T10:00:00Z',
    updated_at: '2023-12-21T10:00:00Z'
  },
  {
    _id: '27',
    name: 'Tas Gym',
    slug: 'tas-gym',
    description: 'Tas olahraga untuk gym dan fitness',
    icon: '',
    product_count: 22,
    created_at: '2023-12-20T10:00:00Z',
    updated_at: '2023-12-20T10:00:00Z'
  },
  {
    _id: '28',
    name: 'Tas Bayi',
    slug: 'tas-bayi',
    description: 'Diaper bag untuk keperluan bayi',
    icon: '',
    product_count: 15,
    created_at: '2023-12-19T10:00:00Z',
    updated_at: '2023-12-19T10:00:00Z'
  },
  {
    _id: '29',
    name: 'Tas Kamera',
    slug: 'tas-kamera',
    description: 'Tas khusus untuk peralatan fotografi',
    icon: '',
    product_count: 12,
    created_at: '2023-12-18T10:00:00Z',
    updated_at: '2023-12-18T10:00:00Z'
  },
  {
    _id: '30',
    name: 'Tas Anti Maling',
    slug: 'tas-anti-maling',
    description: 'Anti-theft bag dengan fitur keamanan',
    icon: '',
    product_count: 14,
    created_at: '2023-12-17T10:00:00Z',
    updated_at: '2023-12-17T10:00:00Z'
  },
  // Kategori Utama: Berdasarkan Gaya
  {
    _id: '31',
    name: 'Tas Kasual',
    slug: 'tas-kasual',
    description: 'Tas untuk gaya santai sehari-hari',
    icon: '',
    product_count: 40,
    created_at: '2023-12-16T10:00:00Z',
    updated_at: '2023-12-16T10:00:00Z'
  },
  {
    _id: '32',
    name: 'Tas Fashion',
    slug: 'tas-fashion',
    description: 'Tas stylish mengikuti tren fashion',
    icon: '',
    product_count: 35,
    created_at: '2023-12-15T10:00:00Z',
    updated_at: '2023-12-15T10:00:00Z'
  },
  {
    _id: '33',
    name: 'Tas Formal',
    slug: 'tas-formal',
    description: 'Tas untuk acara formal dan bisnis',
    icon: '',
    product_count: 25,
    created_at: '2023-12-14T10:00:00Z',
    updated_at: '2023-12-14T10:00:00Z'
  },
  {
    _id: '34',
    name: 'Tas Outdoor',
    slug: 'tas-outdoor',
    description: 'Tas untuk hiking dan aktivitas outdoor',
    icon: '',
    product_count: 20,
    created_at: '2023-12-13T10:00:00Z',
    updated_at: '2023-12-13T10:00:00Z'
  },
  {
    _id: '35',
    name: 'Tas Etnik',
    slug: 'tas-etnik',
    description: 'Tas handmade dengan sentuhan etnik',
    icon: '',
    product_count: 18,
    created_at: '2023-12-12T10:00:00Z',
    updated_at: '2023-12-12T10:00:00Z'
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  // Produk Tas Sekolah Anak
  {
    _id: '1',
    name: 'Tas Sekolah Anak Karakter Unicorn',
    slug: 'tas-sekolah-anak-karakter-unicorn',
    description: 'Tas sekolah dengan desain unicorn yang lucu, dilengkapi kompartemen untuk buku dan alat tulis',
    price: 125000,
    original_price: 150000,
    category: DEFAULT_CATEGORIES[0], // Tas Sekolah Anak
    is_featured: true,
    stock: 50,
    images: [{ _id: '1', url: '', alt_text: 'Tas Sekolah Anak Karakter Unicorn', is_primary: true }],
    specifications: { 'Material': 'Polyester', 'Ukuran': '35x25x12 cm', 'Berat': '400g', 'Kompartemen': '3' },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Tas Ransel Karakter Superhero',
    slug: 'tas-ransel-karakter-superhero',
    description: 'Tas ransel dengan karakter superhero favorit anak-anak, tahan lama dan nyaman digunakan',
    price: 135000,
    category: DEFAULT_CATEGORIES[1], // Tas Ransel Karakter
    is_featured: false,
    stock: 35,
    images: [{ _id: '2', url: '', alt_text: 'Tas Ransel Karakter Superhero', is_primary: true }],
    specifications: { 'Material': 'Canvas', 'Ukuran': '30x20x15 cm', 'Berat': '350g', 'Karakter': 'Superhero' },
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    _id: '3',
    name: 'Tas Selempang Anak Colorful',
    slug: 'tas-selempang-anak-colorful',
    description: 'Tas selempang kecil dengan warna-warna cerah untuk aktivitas anak sehari-hari',
    price: 75000,
    original_price: 95000,
    category: DEFAULT_CATEGORIES[2], // Tas Selempang Anak
    is_featured: true,
    stock: 60,
    images: [{ _id: '3', url: '', alt_text: 'Tas Selempang Anak Colorful', is_primary: true }],
    specifications: { 'Material': 'Nylon', 'Ukuran': '20x15x8 cm', 'Berat': '200g', 'Warna': 'Multi' },
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  // Produk Tas Remaja
  {
    _id: '4',
    name: 'Tas Ransel Remaja Minimalis',
    slug: 'tas-ransel-remaja-minimalis',
    description: 'Tas ransel dengan desain minimalis dan modern untuk remaja aktif',
    price: 185000,
    category: DEFAULT_CATEGORIES[6], // Tas Ransel Remaja
    is_featured: true,
    stock: 40,
    images: [{ _id: '4', url: '', alt_text: 'Tas Ransel Remaja Minimalis', is_primary: true }],
    specifications: { 'Material': 'Canvas Premium', 'Ukuran': '40x30x15 cm', 'Berat': '600g', 'Laptop': '14 inch' },
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    _id: '5',
    name: 'Tote Bag Remaja Aesthetic',
    slug: 'tote-bag-remaja-aesthetic',
    description: 'Tote bag dengan desain aesthetic yang trendy untuk remaja',
    price: 95000,
    original_price: 120000,
    category: DEFAULT_CATEGORIES[8], // Tote Bag Remaja
    is_featured: false,
    stock: 55,
    images: [{ _id: '5', url: '', alt_text: 'Tote Bag Remaja Aesthetic', is_primary: true }],
    specifications: { 'Material': 'Canvas', 'Ukuran': '35x40x10 cm', 'Berat': '300g', 'Handle': 'Panjang' },
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z'
  },
  // Produk Tas Dewasa
  {
    _id: '6',
    name: 'Tote Bag Premium Leather',
    slug: 'tote-bag-premium-leather',
    description: 'Tote bag kulit premium untuk gaya elegan sehari-hari',
    price: 350000,
    original_price: 450000,
    category: DEFAULT_CATEGORIES[12], // Tote Bag
    is_featured: true,
    stock: 25,
    images: [{ _id: '6', url: '', alt_text: 'Tote Bag Premium Leather', is_primary: true }],
    specifications: { 'Material': 'Kulit Asli', 'Ukuran': '40x35x15 cm', 'Berat': '800g', 'Warna': 'Coklat' },
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    _id: '7',
    name: 'Backpack Dewasa Professional',
    slug: 'backpack-dewasa-professional',
    description: 'Tas ransel profesional dengan kompartemen laptop dan desain elegan',
    price: 285000,
    category: DEFAULT_CATEGORIES[14], // Backpack Dewasa
    is_featured: true,
    stock: 30,
    images: [{ _id: '7', url: '', alt_text: 'Backpack Dewasa Professional', is_primary: true }],
    specifications: { 'Material': 'Polyester Premium', 'Ukuran': '45x32x18 cm', 'Laptop': '15.6 inch', 'USB Port': 'Ya' },
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z'
  },
  {
    _id: '8',
    name: 'Tas Laptop Office Executive',
    slug: 'tas-laptop-office-executive',
    description: 'Tas laptop executive untuk keperluan kantor dengan desain formal',
    price: 425000,
    original_price: 550000,
    category: DEFAULT_CATEGORIES[19], // Tas Laptop Office
    is_featured: true,
    stock: 20,
    images: [{ _id: '8', url: '', alt_text: 'Tas Laptop Office Executive', is_primary: true }],
    specifications: { 'Material': 'Kulit Sintetis', 'Ukuran': '42x30x8 cm', 'Laptop': '15 inch', 'Kompartemen': '5' },
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z'
  },
  // Produk Berdasarkan Fungsi
  {
    _id: '9',
    name: 'Tas Gym Sporty Duffel',
    slug: 'tas-gym-sporty-duffel',
    description: 'Tas gym dengan kompartemen sepatu dan botol minum',
    price: 165000,
    category: DEFAULT_CATEGORIES[26], // Tas Gym
    is_featured: false,
    stock: 45,
    images: [{ _id: '9', url: '', alt_text: 'Tas Gym Sporty Duffel', is_primary: true }],
    specifications: { 'Material': 'Nylon Waterproof', 'Ukuran': '50x25x25 cm', 'Kompartemen Sepatu': 'Ya', 'Tahan Air': 'Ya' },
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z'
  },
  {
    _id: '10',
    name: 'Tas Anti Maling Smart Security',
    slug: 'tas-anti-maling-smart-security',
    description: 'Tas dengan fitur anti maling, USB charging port dan material cut-resistant',
    price: 245000,
    original_price: 320000,
    category: DEFAULT_CATEGORIES[29], // Tas Anti Maling
    is_featured: true,
    stock: 15,
    images: [{ _id: '10', url: '', alt_text: 'Tas Anti Maling Smart Security', is_primary: true }],
    specifications: { 'Material': 'Cut-Resistant Fabric', 'Ukuran': '42x28x15 cm', 'USB Port': 'Ya', 'RFID Blocking': 'Ya' },
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z'
  },
  // Produk Berdasarkan Gaya
  {
    _id: '11',
    name: 'Tas Fashion Trendy Sling',
    slug: 'tas-fashion-trendy-sling',
    description: 'Tas sling dengan desain fashion terkini dan warna-warna trendy',
    price: 145000,
    category: DEFAULT_CATEGORIES[31], // Tas Fashion
    is_featured: false,
    stock: 35,
    images: [{ _id: '11', url: '', alt_text: 'Tas Fashion Trendy Sling', is_primary: true }],
    specifications: { 'Material': 'PU Leather', 'Ukuran': '25x18x8 cm', 'Strap': 'Adjustable', 'Warna': 'Beige' },
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    _id: '12',
    name: 'Tas Outdoor Hiking Adventure',
    slug: 'tas-outdoor-hiking-adventure',
    description: 'Tas hiking dengan kapasitas besar dan fitur outdoor lengkap',
    price: 385000,
    original_price: 480000,
    category: DEFAULT_CATEGORIES[33], // Tas Outdoor
    is_featured: true,
    stock: 18,
    images: [{ _id: '12', url: '', alt_text: 'Tas Outdoor Hiking Adventure', is_primary: true }],
    specifications: { 'Material': 'Ripstop Nylon', 'Kapasitas': '40L', 'Tahan Air': 'Ya', 'Rain Cover': 'Included' },
    created_at: '2024-01-04T10:00:00Z',
    updated_at: '2024-01-04T10:00:00Z'
  }
];

const DEFAULT_PROMOS: Promo[] = [
  {
    _id: '1',
    title: 'Flash Sale Tas Sekolah',
    description: 'Diskon hingga 30% untuk semua tas sekolah anak dan remaja',
    discount_percentage: 25,
    max_discount: 50000,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    applicable_categories: [DEFAULT_CATEGORIES[0], DEFAULT_CATEGORIES[6], DEFAULT_CATEGORIES[22]], // Tas Sekolah Anak, Tas Ransel Remaja, Tas Sekolah
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Promo Tas Kantor Professional',
    description: 'Diskon spesial untuk tas laptop dan tas kantor professional',
    discount_percentage: 20,
    max_discount: 100000,
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-06-30T23:59:59Z',
    applicable_categories: [DEFAULT_CATEGORIES[19], DEFAULT_CATEGORIES[23]], // Tas Laptop Office, Tas Kantor
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    _id: '3',
    title: 'Weekend Sale Tas Fashion',
    description: 'Diskon weekend untuk tas fashion dan tote bag trendy',
    discount_percentage: 15,
    max_discount: 75000,
    start_date: '2024-02-01T00:00:00Z',
    end_date: '2024-05-31T23:59:59Z',
    applicable_categories: [DEFAULT_CATEGORIES[12], DEFAULT_CATEGORIES[31]], // Tote Bag, Tas Fashion
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