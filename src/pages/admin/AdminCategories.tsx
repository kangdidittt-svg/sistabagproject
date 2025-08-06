import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Grid,
  MoreVertical,
  Download,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Category } from '../../services/api';
import { LoadingSpinner, Pagination, SearchBar, EmptyState } from '../../components/shared';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const itemsPerPage = 12;

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const mockCategories: Category[] = [
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
          },
          {
            _id: '6',
            name: 'Makanan & Minuman',
            slug: 'makanan-minuman',
            description: 'Makanan, minuman, dan produk konsumsi',
            icon: '',
            product_count: 22,
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-10T10:00:00Z'
          }
        ];

        setCategories(mockCategories);
        setTotalItems(mockCategories.length);
        setTotalPages(Math.ceil(mockCategories.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, searchTerm, sortBy]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c._id));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Hapus ${selectedCategories.length} kategori yang dipilih?`)) {
      // Implement delete logic
      setSelectedCategories([]);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Hapus kategori ini? Semua produk dalam kategori ini akan dipindahkan ke kategori lain.')) {
      // Implement delete logic
    }
  };

  const filteredCategories = categories.filter(category => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalProducts = categories.reduce((sum, category) => sum + (category.product_count || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Memuat kategori..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola kategori produk dalam katalog Anda
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <Link
            to="/admin/categories/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Grid className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Kategori</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Produk</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ImageIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dengan Gambar</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.icon).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Grid className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rata-rata Produk</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Cari kategori..."
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name_asc">Nama A-Z</option>
              <option value="name_desc">Nama Z-A</option>
              <option value="product_count_desc">Produk Terbanyak</option>
              <option value="product_count_asc">Produk Tersedikit</option>
              <option value="created_at_desc">Terbaru</option>
              <option value="created_at_asc">Terlama</option>
            </select>
            
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm border-l ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCategories.length} kategori dipilih
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

      {/* Categories Content */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white shadow-sm border rounded-lg">
          <EmptyState
            type="categories"
            title="Tidak ada kategori"
            description="Belum ada kategori yang sesuai dengan pencarian Anda."
            actionText="Tambah Kategori"
            onAction={() => window.location.href = '/admin/categories/new'}
          />
        </div>
      ) : (
        <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
          {viewMode === 'table' ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedCategories.length === filteredCategories.length}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dibuat
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => handleSelectCategory(category._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                {category.icon ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={`https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '%20') + '%20category%20icon%20minimalist')}&image_size=square`}
                                    alt={category.name}
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-blue-600" />
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                /{category.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {category.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.product_count || 0} produk
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(category.created_at || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/category/${category.slug}`}
                              className="text-gray-400 hover:text-gray-600"
                              title="Lihat"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/categories/edit/${category._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category) => (
                  <div key={category._id} className="group relative bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleSelectCategory(category._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                          {category.icon ? (
                            <img
                              className="h-16 w-16 rounded-full object-cover"
                              src={`https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '%20') + '%20category%20icon%20minimalist')}&image_size=square`}
                              alt={category.name}
                            />
                          ) : (
                            <Package className="h-8 w-8 text-blue-600" />
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                        {category.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category.product_count || 0} produk
                        </span>
                      </div>
                      
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/category/${category.slug}`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Lihat"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/categories/edit/${category._id}`}
                          className="p-2 text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="p-2 text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
        </div>
      )}
    </div>
  );
};

export default AdminCategories;