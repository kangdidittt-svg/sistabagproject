import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Tag,
  Calendar,
  Percent,
  Clock,
  TrendingUp,
  Download,
  Copy
} from 'lucide-react';
import { Promo, Category } from '../../services/api';
import { LoadingSpinner, Pagination, SearchBar, EmptyState } from '../../components/shared';
import { LocalStorageService } from '../../services/localStorage';

const AdminPromos: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('created_at_desc');
  const itemsPerPage = 10;

  // Load data from localStorage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load categories from localStorage
        const categoriesData = LocalStorageService.getCategories();
        setCategories(categoriesData);
        
        // Load promos from localStorage
        const promosData = LocalStorageService.getPromos();
        setPromos(promosData);
        
        setTotalItems(promosData.length);
        setTotalPages(Math.ceil(promosData.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, statusFilter, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPromoStatus = (promo: Promo) => {
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);

    if (!promo.is_active) {
      return { status: 'inactive', label: 'Nonaktif', color: 'bg-gray-100 text-gray-800' };
    } else if (now < startDate) {
      return { status: 'upcoming', label: 'Akan Datang', color: 'bg-yellow-100 text-yellow-800' };
    } else if (now > endDate) {
      return { status: 'expired', label: 'Berakhir', color: 'bg-red-100 text-red-800' };
    } else {
      return { status: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' };
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSelectPromo = (promoId: string) => {
    setSelectedPromos(prev => 
      prev.includes(promoId)
        ? prev.filter(id => id !== promoId)
        : [...prev, promoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPromos.length === promos.length) {
      setSelectedPromos([]);
    } else {
      setSelectedPromos(promos.map(p => p._id));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Hapus ${selectedPromos.length} promo yang dipilih?`)) {
      // Implement delete logic
      setSelectedPromos([]);
    }
  };

  const handleDeletePromo = (promoId: string) => {
    if (window.confirm('Hapus promo ini?')) {
      // Implement delete logic
    }
  };

  const handleToggleActive = (promoId: string) => {
    // Implement toggle active logic
  };

  const handleDuplicatePromo = (promoId: string) => {
    // Implement duplicate logic
  };

  const filteredPromos = promos.filter(promo => {
    const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const status = getPromoStatus(promo).status;
      matchesStatus = status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const activePromos = promos.filter(p => getPromoStatus(p).status === 'active').length;
  const upcomingPromos = promos.filter(p => getPromoStatus(p).status === 'upcoming').length;
  const expiredPromos = promos.filter(p => getPromoStatus(p).status === 'expired').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Memuat promo..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Promo</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola promosi dan penawaran khusus
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <Link
            to="/admin/promos/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Promo
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Promo</p>
              <p className="text-2xl font-bold text-gray-900">{promos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promo Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{activePromos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Akan Datang</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingPromos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Berakhir</p>
              <p className="text-2xl font-bold text-gray-900">{expiredPromos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari promo..."
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="upcoming">Akan Datang</option>
              <option value="expired">Berakhir</option>
              <option value="inactive">Nonaktif</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at_desc">Terbaru</option>
              <option value="created_at_asc">Terlama</option>
              <option value="start_date_desc">Mulai Terbaru</option>
              <option value="start_date_asc">Mulai Terlama</option>
              <option value="discount_desc">Diskon Tertinggi</option>
              <option value="discount_asc">Diskon Terendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPromos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedPromos.length} promo dipilih
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Hapus
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promos Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {filteredPromos.length === 0 ? (
          <EmptyState
            type="promos"
            title="Tidak ada promo"
            description="Belum ada promo yang sesuai dengan filter Anda."
            actionText="Tambah Promo"
            onAction={() => window.location.href = '/admin/promos/new'}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPromos.length === filteredPromos.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diskon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPromos.map((promo) => {
                    const status = getPromoStatus(promo);
                    const daysRemaining = getDaysRemaining(promo.end_date);
                    
                    return (
                      <tr key={promo._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPromos.includes(promo._id)}
                            onChange={() => handleSelectPromo(promo._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                                <Tag className="h-6 w-6 text-red-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {promo.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {promo.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Percent className="h-4 w-4 text-red-600 mr-1" />
                              <span className="font-bold text-red-600">{promo.discount_percentage}%</span>
                            </div>
                            {promo.max_discount && (
                              <div className="text-xs text-gray-500">
                                Maks. {formatPrice(promo.max_discount)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(promo.start_date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            s/d {formatDate(promo.end_date)}
                          </div>
                          {status.status === 'active' && daysRemaining > 0 && daysRemaining <= 7 && (
                            <div className="text-xs text-red-600 font-medium mt-1">
                              {daysRemaining} hari lagi
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {promo.applicable_categories?.slice(0, 2).map((category) => (
                              <span key={category._id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {category.name}
                              </span>
                            ))}
                            {promo.applicable_categories && promo.applicable_categories.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{promo.applicable_categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/catalog?promo=${promo._id}`}
                              className="text-gray-400 hover:text-gray-600"
                              title="Lihat Produk"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDuplicatePromo(promo._id)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Duplikat"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <Link
                              to={`/admin/promos/edit/${promo._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeletePromo(promo._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPromos;