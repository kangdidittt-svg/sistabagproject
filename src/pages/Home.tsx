import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Users, Award, Tag, Clock, Percent } from 'lucide-react';
import { ProductCard, PromoCard, LoadingSpinner } from '../components/shared';
import { Product, Promo, Category } from '../services/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activePromos, setActivePromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock categories
        const mockCategories: Category[] = [
          { _id: '1', name: 'Elektronik', slug: 'elektronik', description: 'Produk elektronik', product_count: 25 },
          { _id: '2', name: 'Fashion', slug: 'fashion', description: 'Produk fashion', product_count: 18 },
          { _id: '3', name: 'Olahraga', slug: 'olahraga', description: 'Produk olahraga', product_count: 12 }
        ];

        // Mock featured products with promos
        const mockFeaturedProducts: Product[] = [
          {
            _id: '1',
            name: 'Smartphone Android Terbaru',
            slug: 'smartphone-android-terbaru',
            description: 'Smartphone dengan teknologi terdepan dan kamera canggih',
            price: 2500000,
            original_price: 3000000,
            main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20smartphone%20android%20sleek%20design%20black%20color%20high%20quality%20product%20photography&image_size=square',
            category: mockCategories[0],
            is_featured: true,
            stock: 50,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          },
          {
            _id: '2',
            name: 'Sepatu Olahraga Premium',
            slug: 'sepatu-olahraga-premium',
            description: 'Sepatu olahraga dengan teknologi cushioning terbaru',
            price: 850000,
            original_price: 1200000,
            main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20sports%20shoes%20white%20blue%20modern%20athletic%20design%20product%20photography&image_size=square',
            category: mockCategories[2],
            is_featured: true,
            stock: 100,
            created_at: '2024-01-13T10:00:00Z',
            updated_at: '2024-01-13T10:00:00Z'
          },
          {
            _id: '3',
            name: 'Blender Multifungsi',
            slug: 'blender-multifungsi',
            description: 'Blender dengan berbagai fungsi untuk kebutuhan dapur modern',
            price: 450000,
            original_price: 600000,
            main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20kitchen%20blender%20stainless%20steel%20multifunctional%20appliance%20product%20photography&image_size=square',
            category: mockCategories[1],
            is_featured: true,
            stock: 30,
            created_at: '2024-01-11T10:00:00Z',
            updated_at: '2024-01-11T10:00:00Z'
          },
          {
            _id: '4',
            name: 'Laptop Gaming Performance',
            slug: 'laptop-gaming-performance',
            description: 'Laptop gaming dengan performa tinggi untuk gaming dan produktivitas',
            price: 15000000,
            main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20laptop%20black%20rgb%20keyboard%20modern%20design%20high%20performance%20product%20photography&image_size=square',
            category: mockCategories[0],
            is_featured: true,
            stock: 25,
            created_at: '2024-01-14T10:00:00Z',
            updated_at: '2024-01-14T10:00:00Z'
          }
        ];

        // Mock active promos
        const mockPromos: Promo[] = [
          {
            _id: '1',
            title: 'Flash Sale Elektronik',
            description: 'Diskon besar-besaran untuk semua produk elektronik hingga 50%',
            discount_percentage: 30,
            max_discount: 500000,
            start_date: '2024-01-15T00:00:00Z',
            end_date: '2024-01-25T23:59:59Z',
            applicable_categories: [mockCategories[0]],
            is_active: true,
            image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=electronics%20flash%20sale%20banner%20modern%20design%20blue%20gradient%20shopping%20promotion&image_size=landscape_16_9',
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-10T10:00:00Z'
          },
          {
            _id: '2',
            title: 'Fashion Week Special',
            description: 'Koleksi fashion terbaru dengan harga spesial',
            discount_percentage: 25,
            max_discount: 300000,
            start_date: '2024-01-20T00:00:00Z',
            end_date: '2024-01-30T23:59:59Z',
            applicable_categories: [mockCategories[1]],
            is_active: true,
            image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20week%20sale%20banner%20elegant%20design%20pink%20purple%20gradient%20clothing%20promotion&image_size=landscape_16_9',
            created_at: '2024-01-09T10:00:00Z',
            updated_at: '2024-01-09T10:00:00Z'
          }
        ];

        setFeaturedProducts(mockFeaturedProducts);
        setActivePromos(mockPromos);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Memuat halaman..." />
      </div>
    );
  }

  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Temukan Produk
              <span className="block text-blue-200">Terbaik untuk Anda</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Jelajahi ribuan produk berkualitas dengan harga terbaik. 
              Dari elektronik hingga fashion, semua ada di sini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Jelajahi Katalog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/promos"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Lihat Promo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Active Promos Section */}
      {activePromos.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Tag className="h-8 w-8 text-red-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Promo Spesial Hari Ini
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Jangan lewatkan penawaran terbatas dengan diskon hingga 50%
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activePromos.map(promo => (
                <PromoCard
                  key={promo._id}
                  promo={promo}
                  size="large"
                  layout="banner"
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                to="/catalog?promo=active"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <Percent className="h-5 w-5 mr-2" />
                Lihat Semua Promo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-yellow-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Produk Unggulan
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Produk pilihan dengan kualitas terbaik dan harga spesial
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  showAddToCart
                  showWishlist
                  imageSize="medium"
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                to="/catalog?featured=true"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lihat Semua Produk Unggulan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Memilih E-Katalog?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan pengalaman berbelanja yang mudah dan menyenangkan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Produk Berkualitas
              </h3>
              <p className="text-gray-600">
                Semua produk telah melalui kurasi ketat untuk memastikan kualitas terbaik
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Harga Terbaik
              </h3>
              <p className="text-gray-600">
                Dapatkan harga kompetitif dan promo menarik setiap harinya
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Layanan Terpercaya
              </h3>
              <p className="text-gray-600">
                Tim customer service yang siap membantu Anda 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Produk Tersedia</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Kategori</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Pelanggan Puas</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">99%</div>
              <div className="text-gray-600">Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Siap Menemukan Produk Impian Anda?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pelanggan yang telah merasakan pengalaman berbelanja terbaik
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mulai Belanja Sekarang
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}