import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Tag, Percent, Calendar } from 'lucide-react';
import { Promo } from '../services/api';
import { LocalStorageService } from '../services/localStorage';
import { LoadingSpinner } from '../components/shared';

export default function Promos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, upcoming, expired
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load promos from localStorage
  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      try {
        const promosData = LocalStorageService.getPromos();
        setPromos(promosData);
      } catch (error) {
        console.error('Error fetching promos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  // Fallback mock data if no promos in localStorage
  const mockPromos = [
    {
      _id: '1',
      title: 'Flash Sale Smartphone',
      description: 'Diskon besar-besaran untuk smartphone flagship premium',
      discount_percentage: 15,
      max_discount: 1500000,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      is_active: true,
      applicable_categories: ['elektronik'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20smartphone%20android%20black%20sleek%20design%20flagship%20product%20photography&image_size=square',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      _id: '2',
      title: 'Diskon Earbuds Premium',
      description: 'Promo spesial untuk earbuds wireless premium',
      discount_percentage: 20,
      max_discount: 300000,
      start_date: '2024-01-15',
      end_date: '2024-12-31',
      is_active: true,
      applicable_categories: ['elektronik'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20earbuds%20white%20premium%20design%20pro%20max%20version%20product%20photography&image_size=square',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      _id: '3',
      title: 'Promo Sepatu Olahraga',
      description: 'Diskon besar untuk sepatu running professional',
      discount_percentage: 25,
      max_discount: 250000,
      start_date: '2024-02-01',
      end_date: '2024-12-31',
      is_active: true,
      applicable_categories: ['olahraga'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20running%20shoes%20blue%20white%20athletic%20design%20sport%20product%20photography&image_size=square',
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z'
    },
    {
      _id: '4',
      title: 'Mega Sale Laptop Gaming',
      description: 'Promo laptop gaming dengan performa tinggi',
      discount_percentage: 12,
      max_discount: 3000000,
      start_date: '2024-01-20',
      end_date: '2024-12-31',
      is_active: true,
      applicable_categories: ['elektronik'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=gaming%20laptop%20black%20rgb%20keyboard%20rtx%204070%20high%20performance%20product%20photography&image_size=square',
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z'
    },
    {
      _id: '5',
      title: 'Diskon Smartwatch Fitness',
      description: 'Promo smartwatch untuk monitoring kesehatan',
      discount_percentage: 18,
      max_discount: 360000,
      start_date: '2024-01-10',
      end_date: '2024-12-31',
      is_active: true,
      applicable_categories: ['elektronik'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=smartwatch%20health%20monitor%20black%20sport%20band%20modern%20fitness%20tracking%20product%20photography&image_size=square',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    }
  ];

  // Combine localStorage promos with mock data if needed
  const allPromos = promos.length > 0 ? promos : mockPromos;

  const filteredPromos = allPromos.filter(promo => {
    const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (promo.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);
    
    switch (filterType) {
      case 'active':
        matchesFilter = promo.is_active && startDate <= now && endDate >= now;
        break;
      case 'upcoming':
        matchesFilter = promo.is_active && startDate > now;
        break;
      case 'expired':
        matchesFilter = endDate < now;
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPromoStatus = (promo: any) => {
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);
    
    if (!promo.is_active) return { status: 'inactive', label: 'Tidak Aktif', color: 'gray' };
    if (startDate > now) return { status: 'upcoming', label: 'Akan Datang', color: 'blue' };
    if (endDate < now) return { status: 'expired', label: 'Berakhir', color: 'red' };
    return { status: 'active', label: 'Aktif', color: 'green' };
  };



  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Promo Terbaru</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Jangan lewatkan penawaran menarik dan diskon besar-besaran untuk produk pilihan
        </p>
      </div>

      {/* Hero Promo Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 mb-6 lg:mb-0">
            <div className="flex items-center mb-4">
              <Tag className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                PROMO SPESIAL
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Diskon Hingga 25%</h2>
            <p className="text-red-100 mb-4">
              Untuk semua kategori produk elektronik dan fashion terpilih
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Belanja Sekarang
            </Link>
          </div>
          <div className="flex items-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold">25%</div>
              <div className="text-red-200 text-sm">Diskon Maksimal</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{filteredPromos.length}</div>
              <div className="text-red-200 text-sm">Promo Aktif</div>
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
                placeholder="Cari promo atau produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="lg:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Promo</option>
              <option value="active">Promo Aktif</option>
              <option value="upcoming">Akan Datang</option>
              <option value="expired">Berakhir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Menampilkan {filteredPromos.length} promo
          {searchTerm && ` untuk "${searchTerm}"`}
        </p>
      </div>

      {/* Promos Grid */}
      {filteredPromos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Tag className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Promo tidak ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromos.map(promo => {
            const status = getPromoStatus(promo);
            
            return (
              <div
                key={promo._id}
                className="group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Promo Header */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-20`}>
                      {status.label}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{promo.discount_percentage}%</div>
                      <div className="text-xs text-red-100">OFF</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">{promo.title}</h3>
                </div>

                {/* Promo Info */}
                <div className="block">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{promo.discount_percentage}%
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {promo.title}
                    </h4>
                    
                    <div className="space-y-1 mb-3">
                      <div className="text-sm text-gray-600 mb-2">
                        {promo.description}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Diskon hingga {promo.discount_percentage}%
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        Maks. diskon {formatPrice(promo.max_discount)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Berlaku: {formatDate(promo.start_date)} - {formatDate(promo.end_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        <span>Kategori: {promo.applicable_categories.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredPromos.length > 0 && (
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

      {/* Newsletter Signup */}
      <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Jangan Lewatkan Promo Terbaru!
        </h2>
        <p className="text-gray-600 mb-6">
          Daftarkan email Anda untuk mendapatkan notifikasi promo dan penawaran eksklusif
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Masukkan email Anda"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}