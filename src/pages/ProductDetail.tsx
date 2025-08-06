import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Check, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Product } from '../services/api';
import { LocalStorageService } from '../services/localStorage';
import { LoadingSpinner } from '../components/shared';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [viewCount, setViewCount] = useState(0);

  // Mock color variants
  const colorVariants = [
    { name: 'Hitam', value: '#000000', available: true },
    { name: 'Putih', value: '#FFFFFF', available: true },
    { name: 'Biru', value: '#3B82F6', available: true },
    { name: 'Merah', value: '#EF4444', available: false }
  ];

  // Update wishlist status when product changes
  useEffect(() => {
    if (product) {
      setIsWishlisted(LocalStorageService.isInWishlist(product._id));
      // Set default color
      if (colorVariants.length > 0) {
        setSelectedColor(colorVariants[0].name);
      }
      // Simulate view count
      setViewCount(Math.floor(Math.random() * 1000) + 100);
    }
  }, [product]);

  const handleWishlistToggle = () => {
    if (product) {
      const newWishlistStatus = LocalStorageService.toggleWishlist(product._id);
      setIsWishlisted(newWishlistStatus);
    }
  };

  // Load product data from localStorage
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const products = LocalStorageService.getProducts();
        const foundProduct = products.find(p => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Get related products from same category
          const related = products
            .filter(p => p._id !== foundProduct._id && p.category._id === foundProduct.category._id)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  const nextImage = () => {
    const imageCount = product.images?.length || 1;
    setSelectedImageIndex((prev) => 
      prev === imageCount - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    const imageCount = product.images?.length || 1;
    setSelectedImageIndex((prev) => 
      prev === 0 ? imageCount - 1 : prev - 1
    );
  };

  const getCurrentImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[selectedImageIndex];
    }
    return {
      url: product.main_image_url || '',
      alt_text: product.name
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Maaf, produk yang Anda cari tidak tersedia.</p>
          <Link
            to="/catalog"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={getCurrentImage().url}
              alt={getCurrentImage().alt_text}
              className="w-full h-full object-contain"
            />
            
            {/* Navigation Arrows */}
            {product.images && product.images.length > 1 && (
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
              {product.original_price && product.original_price > product.price && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Diskon {calculateDiscount()}%
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image._id || index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt_text}
                    className="w-full h-full object-contain"
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
            {product.original_price && product.original_price > product.price ? (
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

          {/* Color Variants */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pilih Warna</h3>
            <div className="flex flex-wrap gap-3">
              {colorVariants.map((color) => (
                <button
                  key={color.name}
                  onClick={() => color.available && setSelectedColor(color.name)}
                  disabled={!color.available}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    selectedColor === color.name
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : color.available
                      ? 'border-gray-300 hover:border-gray-400'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      color.value === '#FFFFFF' ? 'border-gray-300' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                  <span className={`text-sm ${
                    color.available ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {color.name}
                  </span>
                  {!color.available && (
                    <X className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Stock */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Jumlah</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Stok tersedia: <span className="font-medium text-green-600">{product.stock || 50} unit</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Hubungi Penjual
            </button>
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border">
              <Eye className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                Dilihat {viewCount.toLocaleString()} kali
              </span>
            </div>
            <button className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
              <Share2 className="h-5 w-5 mr-2" />
              Bagikan
            </button>
          </div>

          {/* Promo Info */}
          {product.original_price && product.original_price > product.price && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-1">Promo Spesial</h4>
              <p className="text-sm text-red-600">
                Hemat {formatPrice(product.original_price - product.price)} dari harga normal
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
              key={relatedProduct._id}
              to={`/product/${relatedProduct.slug}`}
              className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-[3/4] bg-gray-100">
                <img
                  src={relatedProduct.images?.[0]?.url || `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(relatedProduct.name.toLowerCase().replace(/\s+/g, '%20') + '%20product%20photography')}&image_size=square`}
                  alt={relatedProduct.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
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