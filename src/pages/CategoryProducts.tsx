import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Grid, List, SortAsc, Package } from 'lucide-react';

export default function CategoryProducts() {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with API calls
  const category = {
    id: '1',
    name: 'Elektronik',
    slug: 'elektronik',
    description: 'Temukan berbagai produk elektronik terbaru dengan teknologi canggih dan kualitas terbaik',
    icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=electronics%20category%20banner%20modern%20devices%20blue%20gradient&image_size=landscape_16_9',
    product_count: 245
  };

  const products = [
    {
      id: '1',
      name: 'Smartphone Android Flagship',
      slug: 'smartphone-android-flagship',
      price: 8500000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20smartphone%20android%20black%20sleek%20design%20flagship%20product%20photography&image_size=square',
      is_featured: true,
      has_promo: true,
      original_price: 9500000
    },
    {
      id: '2',
      name: 'Laptop Gaming RTX 4060',
      slug: 'laptop-gaming-rtx-4060',
      price: 18500000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20laptop%20black%20rgb%20keyboard%20rtx%204060%20high%20performance%20product%20photography&image_size=square',
      is_featured: false,
      has_promo: false
    },
    {
      id: '3',
      name: 'Wireless Earbuds Pro',
      slug: 'wireless-earbuds-pro',
      price: 1250000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20earbuds%20white%20premium%20design%20pro%20version%20product%20photography&image_size=square',
      is_featured: true,
      has_promo: true,
      original_price: 1500000
    },
    {
      id: '4',
      name: 'Smart TV 55 Inch 4K',
      slug: 'smart-tv-55-inch-4k',
      price: 7200000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20tv%2055%20inch%204k%20ultra%20hd%20black%20modern%20design%20product%20photography&image_size=square',
      is_featured: false,
      has_promo: false
    },
    {
      id: '5',
      name: 'Tablet Android 12 Inch',
      slug: 'tablet-android-12-inch',
      price: 4500000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=android%20tablet%2012%20inch%20silver%20modern%20design%20productivity%20product%20photography&image_size=square',
      is_featured: false,
      has_promo: true,
      original_price: 5200000
    },
    {
      id: '6',
      name: 'Smartwatch Fitness Tracker',
      slug: 'smartwatch-fitness-tracker',
      price: 2100000,
      main_image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=smartwatch%20fitness%20tracker%20black%20sport%20band%20modern%20health%20monitoring%20product%20photography&image_size=square',
      is_featured: true,
      has_promo: false
    }
  ];

  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'featured':
        return b.is_featured ? 1 : -1;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">Beranda</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-blue-600">Kategori</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <Link
                to="/categories"
                className="inline-flex items-center text-blue-200 hover:text-white mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali ke Kategori
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-blue-100 mb-4 max-w-2xl">
              {category.description}
            </p>
            <div className="flex items-center text-blue-200">
              <Package className="h-4 w-4 mr-2" />
              <span>{category.product_count} produk tersedia</span>
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
            <div className="w-32 h-32 bg-white bg-opacity-10 rounded-lg overflow-hidden">
              <img
                src={category.icon_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Cari produk dalam ${category.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Urutkan: Nama A-Z</option>
              <option value="price-low">Harga: Rendah ke Tinggi</option>
              <option value="price-high">Harga: Tinggi ke Rendah</option>
              <option value="featured">Produk Unggulan</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Menampilkan {sortedProducts.length} produk
          {searchTerm && ` untuk "${searchTerm}"`}
        </p>
      </div>

      {/* Products Grid/List */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Produk tidak ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian</p>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {sortedProducts.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className={`group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={product.main_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_featured && (
                        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Unggulan
                        </div>
                      )}
                      {product.has_promo && product.original_price && (
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          -{calculateDiscount(product.original_price, product.price)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="space-y-1">
                      {product.has_promo && product.original_price ? (
                        <>
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            {formatPrice(product.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gray-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                    <img
                      src={product.main_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {product.is_featured && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Unggulan
                            </span>
                          )}
                          {product.has_promo && product.original_price && (
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              Diskon {calculateDiscount(product.original_price, product.price)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {product.has_promo && product.original_price ? (
                          <>
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(product.original_price)}
                            </p>
                            <p className="text-lg font-bold text-red-600">
                              {formatPrice(product.price)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-blue-600">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {sortedProducts.length > 0 && (
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Sebelumnya
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}