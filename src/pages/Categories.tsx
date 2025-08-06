import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';

export default function Categories() {
  // Mock data - will be replaced with API calls
  const categories = [
    {
      id: '1',
      name: 'Elektronik',
      slug: 'elektronik',
      description: 'Smartphone, laptop, gadget, dan perangkat elektronik terbaru',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=electronics%20icon%20smartphone%20laptop%20modern%20blue%20minimalist%20design&image_size=square',
      product_count: 245
    },
    {
      id: '2',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Pakaian, sepatu, tas, dan aksesoris fashion terkini',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20icon%20clothing%20shoes%20accessories%20stylish%20pink%20minimalist%20design&image_size=square',
      product_count: 189
    },
    {
      id: '3',
      name: 'Rumah Tangga',
      slug: 'rumah-tangga',
      description: 'Peralatan dapur, furniture, dekorasi, dan kebutuhan rumah',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=home%20appliances%20icon%20kitchen%20furniture%20house%20green%20minimalist%20design&image_size=square',
      product_count: 156
    },
    {
      id: '4',
      name: 'Olahraga',
      slug: 'olahraga',
      description: 'Peralatan fitness, sepatu olahraga, dan perlengkapan sport',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20equipment%20icon%20fitness%20athletic%20orange%20minimalist%20design&image_size=square',
      product_count: 98
    },
    {
      id: '5',
      name: 'Kesehatan',
      slug: 'kesehatan',
      description: 'Suplemen, vitamin, alat kesehatan, dan produk perawatan',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=health%20medical%20icon%20vitamins%20healthcare%20red%20minimalist%20design&image_size=square',
      product_count: 87
    },
    {
      id: '6',
      name: 'Kecantikan',
      slug: 'kecantikan',
      description: 'Skincare, makeup, parfum, dan produk perawatan kecantikan',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beauty%20cosmetics%20icon%20skincare%20makeup%20purple%20minimalist%20design&image_size=square',
      product_count: 134
    },
    {
      id: '7',
      name: 'Otomotif',
      slug: 'otomotif',
      description: 'Aksesoris mobil, motor, spare part, dan perawatan kendaraan',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=automotive%20icon%20car%20motorcycle%20parts%20black%20minimalist%20design&image_size=square',
      product_count: 76
    },
    {
      id: '8',
      name: 'Makanan & Minuman',
      slug: 'makanan-minuman',
      description: 'Makanan ringan, minuman, bumbu masak, dan produk kuliner',
      icon_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=food%20beverage%20icon%20snacks%20drinks%20yellow%20minimalist%20design&image_size=square',
      product_count: 112
    }
  ];

  const totalProducts = categories.reduce((sum, category) => sum + category.product_count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Kategori Produk</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Jelajahi {categories.length} kategori dengan total {totalProducts.toLocaleString('id-ID')} produk berkualitas
        </p>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600">Kategori Tersedia</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalProducts.toLocaleString('id-ID')}
            </div>
            <div className="text-gray-600">Total Produk</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              100%
            </div>
            <div className="text-gray-600">Produk Berkualitas</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={category.icon_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </p>
              
              {/* Product Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="h-4 w-4 mr-1" />
                  <span>{category.product_count} produk</span>
                </div>
                
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Categories Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Kategori Terpopuler
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories
            .sort((a, b) => b.product_count - a.product_count)
            .slice(0, 3)
            .map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white overflow-hidden"
              >
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold">#{index + 1}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="text-2xl font-bold">
                    {category.product_count} produk
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center bg-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tidak Menemukan Kategori yang Dicari?
        </h2>
        <p className="text-gray-600 mb-6">
          Jelajahi semua produk kami atau gunakan fitur pencarian untuk menemukan produk spesifik
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lihat Semua Produk
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/catalog?search=true"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Cari Produk
          </Link>
        </div>
      </div>
    </div>
  );
}