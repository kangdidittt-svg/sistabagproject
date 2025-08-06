import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react';
import { Category } from '../../services/api';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryIds: string[]) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true
  });

  const [tempPriceRange, setTempPriceRange] = useState(priceRange);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newSelected);
  };

  const handlePriceRangeApply = () => {
    onPriceRangeChange(tempPriceRange);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const sortOptions = [
    { value: 'name_asc', label: 'Nama A-Z' },
    { value: 'name_desc', label: 'Nama Z-A' },
    { value: 'price_asc', label: 'Harga Terendah' },
    { value: 'price_desc', label: 'Harga Tertinggi' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'featured', label: 'Unggulan' }
  ];

  const priceRanges = [
    { min: 0, max: 100000, label: 'Di bawah Rp 100rb' },
    { min: 100000, max: 500000, label: 'Rp 100rb - 500rb' },
    { min: 500000, max: 1000000, label: 'Rp 500rb - 1jt' },
    { min: 1000000, max: 5000000, label: 'Rp 1jt - 5jt' },
    { min: 5000000, max: Infinity, label: 'Di atas Rp 5jt' }
  ];

  const hasActiveFilters = selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < Infinity;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      
      {/* Panel */}
      <div className={`
        fixed lg:relative top-0 right-0 h-full lg:h-auto
        w-80 lg:w-full bg-white shadow-xl lg:shadow-none
        z-50 lg:z-auto overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
              {hasActiveFilters && (
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {selectedCategories.length + (priceRange.min > 0 || priceRange.max < Infinity ? 1 : 0)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('sort')}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="font-medium text-gray-900">Urutkan</span>
              {expandedSections.sort ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.sort && (
              <div className="mt-3 space-y-2">
                {sortOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => onSortChange(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="font-medium text-gray-900">Kategori</span>
              {expandedSections.categories ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.categories && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryToggle(category._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex-1">{category.name}</span>
                    {category.product_count && (
                      <span className="text-xs text-gray-500">({category.product_count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="font-medium text-gray-900">Rentang Harga</span>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="mt-3 space-y-4">
                {/* Quick Price Ranges */}
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange.min === range.min && priceRange.max === range.max}
                        onChange={() => {
                          const newRange = { min: range.min, max: range.max };
                          setTempPriceRange(newRange);
                          onPriceRangeChange(newRange);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Range */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rentang Kustom
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={tempPriceRange.min || ''}
                      onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempPriceRange.max === Infinity ? '' : tempPriceRange.max || ''}
                      onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) || Infinity }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handlePriceRangeApply}
                    className="mt-2 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;