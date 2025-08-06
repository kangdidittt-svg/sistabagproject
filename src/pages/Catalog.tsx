import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Filter } from 'lucide-react';
import { 
  ProductCard, 
  SearchBar, 
  FilterPanel, 
  Pagination, 
  LoadingSpinner, 
  EmptyState,
  FeaturedProductsSlider 
} from '../components/shared';
import { Product, Category } from '../services/api';
import { LocalStorageService } from '../services/localStorage';

interface PriceRange {
  min: number;
  max: number;
}

interface FilterState {
  categories: string[];
  priceRange: PriceRange;
  sortBy: string;
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    priceRange: { min: 0, max: 50000000 },
    sortBy: searchParams.get('sort') || 'name'
  });
  const itemsPerPage = 12;

  // Load data from localStorage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load categories from localStorage
        const categoriesData = LocalStorageService.getCategories();
        
        // Load products from localStorage
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
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filters.categories.length > 0) params.set('category', filters.categories[0]);
    if (filters.sortBy !== 'name') params.set('sort', filters.sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchTerm, filters, currentPage, setSearchParams]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.categories.length === 0 || 
                           filters.categories.includes(product.category.name);
    
    const matchesPrice = product.price >= filters.priceRange.min && 
                        product.price <= filters.priceRange.max;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'featured':
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const activeFiltersCount = (
    filters.categories.length +
    (filters.priceRange.min > 0 || filters.priceRange.max < 50000000 ? 1 : 0)
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" text="Memuat produk..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Produk</h1>
        <p className="text-gray-600">Temukan produk yang Anda butuhkan dari berbagai kategori</p>
      </div>

      {/* Featured Products Slider */}
      <FeaturedProductsSlider />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari produk..."
              showFilters={true}
              onToggleFilters={() => setShowFilters(!showFilters)}
              filtersActive={showFilters}
            />
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
              title="Tampilan Grid"
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
              title="Tampilan List"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-8">
          <FilterPanel
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            categories={categories}
            selectedCategories={filters.categories}
            onCategoryChange={(categories) => handleFilterChange({ ...filters, categories })}
            priceRange={filters.priceRange}
            onPriceRangeChange={(priceRange) => handleFilterChange({ ...filters, priceRange })}
            sortBy={filters.sortBy}
            onSortChange={(sortBy) => handleFilterChange({ ...filters, sortBy })}
            onClearFilters={() => {
              handleFilterChange({
                categories: [],
                priceRange: { min: 0, max: 50000000 },
                sortBy: 'name'
              });
            }}
          />
        </div>
      )}

      {/* Results Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <p className="text-gray-600">
            Menampilkan {paginatedProducts.length} dari {sortedProducts.length} produk
            {searchTerm && ` untuk "${searchTerm}"`}
            {filters.categories.length > 0 && ` dalam kategori "${filters.categories.join(', ')}"`}
          </p>
          {activeFiltersCount > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {activeFiltersCount} filter aktif
            </p>
          )}
        </div>
        
        {/* Quick Sort */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Urutkan:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Nama A-Z</option>
            <option value="price_asc">Harga: Rendah ke Tinggi</option>
            <option value="price_desc">Harga: Tinggi ke Rendah</option>
            <option value="newest">Terbaru</option>
            <option value="featured">Unggulan</option>
          </select>
        </div>
      </div>

      {/* Products Grid/List */}
      {sortedProducts.length === 0 ? (
        <EmptyState
          type="search"
          title="Produk tidak ditemukan"
          description="Coba ubah kata kunci pencarian atau filter kategori"
          actionText="Reset Filter"
          onAction={() => {
            setSearchTerm('');
            setFilters({
              categories: [],
              priceRange: { min: 0, max: 50000000 },
              sortBy: 'name'
            });
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {paginatedProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              layout={viewMode}
              showAddToCart
              showWishlist
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {sortedProducts.length > itemsPerPage && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedProducts.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            totalItems={sortedProducts.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}