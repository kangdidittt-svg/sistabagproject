import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock data - will be replaced with API calls
  const product = {
    id: '1',
    name: 'Smartphone Android Flagship Premium',
    slug: 'smartphone-android-flagship-premium',
    description: 'Smartphone flagship terbaru dengan teknologi canggih, kamera berkualitas tinggi, dan performa yang luar biasa. Dilengkapi dengan prosesor terdepan dan fitur-fitur inovatif untuk pengalaman pengguna yang maksimal.',
    price: 8500000,
    original_price: 9500000,
    main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20smartphone%20android%20black%20sleek%20design%20flagship%20product%20photography&image_size=square',
    category: {
      id: '1',
      name: 'Elektronik',
      slug: 'elektronik'
    },
    is_featured: true,
    has_promo: true,
    specifications: {
      'Layar': '6.7 inch AMOLED, 120Hz',
      'Prosesor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB LPDDR5',
      'Storage': '256GB UFS 4.0',
      'Kamera Utama': '200MP + 12MP + 10MP',
      'Kamera Depan': '32MP',
      'Baterai': '5000mAh, Fast Charging 65W',
      'OS': 'Android 14',
      'Konektivitas': '5G, WiFi 7, Bluetooth 5.3',
      'Berat': '195 gram'
    },
    images: [
      {
        id: '1',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20smartphone%20android%20black%20front%20view%20flagship%20product%20photography&image_size=square',
        alt_text: 'Tampak depan smartphone'
      },
      {
        id: '2',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20smartphone%20android%20black%20back%20view%20camera%20flagship%20product%20photography&image_size=square',
        alt_text: 'Tampak belakang smartphone'
      },
      {
        id: '3',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20smartphone%20android%20black%20side%20view%20flagship%20product%20photography&image_size=square',
        alt_text: 'Tampak samping smartphone'
      },
      {
        id: '4',
        image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20smartphone%20android%20black%20accessories%20box%20flagship%20product%20photography&image_size=square',
        alt_text: 'Smartphone dengan aksesoris'
      }
    ],
    promo: {
      id: '1',
      name: 'Flash Sale Smartphone',
      discount_percentage: 10,
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    }
  };

  const relatedProducts = [
    {
      id: '2',
      name: 'Wireless Earbuds Pro',
      slug: 'wireless-earbuds-pro',
      price: 1250000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20earbuds%20white%20premium%20design%20pro%20version%20product%20photography&image_size=square'
    },
    {
      id: '3',
      name: 'Smartwatch Fitness Tracker',
      slug: 'smartwatch-fitness-tracker',
      price: 2100000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=smartwatch%20fitness%20tracker%20black%20sport%20band%20modern%20health%20monitoring%20product%20photography&image_size=square'
    },
    {
      id: '4',
      name: 'Power Bank 20000mAh',
      slug: 'power-bank-20000mah',
      price: 450000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=power%20bank%2020000mah%20black%20portable%20fast%20charging%20product%20photography&image_size=square'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.original_price && product.has_promo) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">Beranda</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-blue-600">Kategori</Link>
        <span>/</span>
        <Link to={`/category/${product.category.slug}`} className="hover:text-blue-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImageIndex].image_url}
              alt={product.images[selectedImageIndex].alt_text}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_featured && (
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Unggulan
                </div>
              )}
              {product.has_promo && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Diskon {calculateDiscount()}%
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <Link
              to={`/category/${product.category.slug}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {product.category.name}
            </Link>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {product.has_promo && product.original_price ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Hemat {formatPrice(product.original_price - product.price)} ({calculateDiscount()}%)
                </div>
              </>
            ) : (
              <span className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Produk</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Hubungi Penjual
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`px-6 py-3 rounded-lg font-medium border transition-colors flex items-center justify-center ${
                isWishlisted
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'Tersimpan' : 'Simpan'}
            </button>
            <button className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Share2 className="h-5 w-5 mr-2" />
              Bagikan
            </button>
          </div>

          {/* Promo Info */}
          {product.has_promo && product.promo && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-1">{product.promo.name}</h4>
              <p className="text-sm text-red-600">
                Diskon {product.promo.discount_percentage}% berlaku hingga akhir tahun
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Spesifikasi Produk</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">{key}</span>
              <span className="text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Terkait</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map(relatedProduct => (
            <Link
              key={relatedProduct.id}
              to={`/product/${relatedProduct.slug}`}
              className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={relatedProduct.main_image_url}
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="text-lg font-bold text-blue-600">
                  {formatPrice(relatedProduct.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}