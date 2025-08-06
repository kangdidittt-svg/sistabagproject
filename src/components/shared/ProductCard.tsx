import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye, Tag } from 'lucide-react';
import { Product } from '../../services/api';
import { LocalStorageService } from '../../services/localStorage';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  className?: string;
  imageSize?: 'small' | 'medium' | 'large';
  layout?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = false,
  showWishlist = false,
  className = '',
  imageSize = 'medium',
  layout = 'grid'
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(LocalStorageService.isInWishlist(product._id));
  }, [product._id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newWishlistStatus = LocalStorageService.toggleWishlist(product._id);
    setIsWishlisted(newWishlistStatus);
  };
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

  const discount = calculateDiscount();
  const mainImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const imageUrl = mainImage?.url || `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '%20') + '%20product%20photography')}&image_size=square`;

  const imageSizeClasses = {
    small: 'aspect-[3/4] h-32',
    medium: 'aspect-[3/4] h-48', 
    large: 'aspect-[3/4] h-64'
  };

  if (layout === 'list') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${className}`}>
        <div className="flex p-4 space-x-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <Link to={`/product/${product.slug}`}>
              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden relative group aspect-[3/4]">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                {discount > 0 && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                    -{discount}%
                  </div>
                )}
                {product.is_featured && (
                  <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded">
                    <Star className="h-3 w-3" />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1">{typeof product.category === 'object' ? product.category.name : 'Kategori'}</p>
                
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Hemat {formatPrice(product.original_price! - product.price)}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                {showWishlist && (
                  <button 
                    onClick={handleWishlistToggle}
                    className={`p-2 transition-colors ${
                      isWishlisted 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                )}
                {showAddToCart && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                )}
                <Link
                  to={`/product/${product.slug}`}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow overflow-hidden ${className}`}>
      {/* Image */}
      <Link to={`/product/${product.slug}`}>
        <div className={`${imageSizeClasses[imageSize]} bg-gray-100 relative overflow-hidden`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.is_featured && (
              <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Unggulan
              </div>
            )}
            {discount > 0 && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{discount}%
              </div>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              {showWishlist && (
                <button 
                  onClick={handleWishlistToggle}
                  className={`p-2 bg-white rounded-full transition-colors shadow-md ${
                    isWishlisted 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              )}
              {showAddToCart && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-600 transition-colors shadow-md"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <Link to={`/category/${product.category.slug}`}>
            <span className="text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium">
              {product.category.name}
            </span>
          </Link>
        </div>
        
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Description (only for larger cards) */}
        {imageSize === 'large' && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <div className="text-sm text-green-600 font-medium">
              Hemat {formatPrice(product.original_price! - product.price)}
            </div>
          )}
        </div>

        {/* Specifications (only for large cards) */}
        {imageSize === 'large' && product.specifications && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {key}: {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {showWishlist && (
              <button 
                onClick={handleWishlistToggle}
                className={`p-2 transition-colors ${
                  isWishlisted 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
          
          {showAddToCart && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex-1 ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;