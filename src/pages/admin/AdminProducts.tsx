import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  Image as ImageIcon,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react';
import { Product, Category } from '../../services/api';
import { LoadingSpinner, Pagination, SearchBar, EmptyState } from '../../components/shared';
import { LocalStorageService } from '../../services/localStorage';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('created_at_desc');
  const itemsPerPage = 10;

  // Load data from localStorage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = LocalStorageService.getCategories();
        const productsData = LocalStorageService.getProducts();
        
        setCategories(categoriesData);
        setProducts(productsData);
        setTotalItems(productsData.length);
        setTotalPages(Math.ceil(productsData.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

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
      year: 'numeric'
    });
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Hapus ${selectedProducts.length} produk yang dipilih?`)) {
      // Implement delete logic
      setSelectedProducts([]);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Hapus produk ini?')) {
      // Implement delete logic
    }
  };

  const handleToggleFeatured = (productId: string) => {
    const newFeaturedStatus = LocalStorageService.toggleProductFeatured(productId);
    // Refresh products list to reflect changes
    const updatedProducts = LocalStorageService.getProducts();
    setProducts(updatedProducts);
    setTotalItems(updatedProducts.length);
    setTotalPages(Math.ceil(updatedProducts.length / itemsPerPage));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Memuat produk..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola semua produk dalam katalog Anda
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Produk</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produk Unggulan</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.is_featured).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ImageIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dengan Gambar</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.images && p.images.length > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kategori</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
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
              placeholder="Cari produk..."
              showFilters
              onToggleFilters={() => setShowFilters(!showFilters)}
              filtersActive={showFilters}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at_desc">Terbaru</option>
              <option value="created_at_asc">Terlama</option>
              <option value="name_asc">Nama A-Z</option>
              <option value="name_desc">Nama Z-A</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedProducts.length} produk dipilih
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

      {/* Products Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        {filteredProducts.length === 0 ? (
          <EmptyState
            type="products"
            title="Tidak ada produk"
            description="Belum ada produk yang sesuai dengan filter Anda."
            actionText="Tambah Produk"
            onAction={() => window.location.href = '/admin/products/new'}
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
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleSelectProduct(product._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={`https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '%20') + '%20product%20photography')}&image_size=square`}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              {product.is_featured && (
                                <Star className="h-4 w-4 text-yellow-500 ml-2" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                        {product.original_price && product.original_price > product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/product/${product.slug}`}
                            className="text-gray-400 hover:text-gray-600"
                            title="Lihat"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleFeatured(product._id)}
                            className={`${product.is_featured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-yellow-600'}`}
                            title="Toggle Unggulan"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
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

export default AdminProducts;