import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { Category } from '../../services/api';

interface CategoryCardProps {
  category: Category;
  showProductCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  showProductCount = true,
  size = 'medium',
  className = ''
}) => {
  const imageUrl = category.icon || `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '%20') + '%20category%20icon%20minimalist')}&image_size=square`;

  const sizeClasses = {
    small: {
      container: 'p-4',
      image: 'h-16 w-16',
      title: 'text-sm font-medium',
      description: 'text-xs',
      count: 'text-xs'
    },
    medium: {
      container: 'p-6',
      image: 'h-20 w-20',
      title: 'text-lg font-semibold',
      description: 'text-sm',
      count: 'text-sm'
    },
    large: {
      container: 'p-8',
      image: 'h-24 w-24',
      title: 'text-xl font-bold',
      description: 'text-base',
      count: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <Link
      to={`/category/${category.slug}`}
      className={`group block bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 hover:border-blue-200 ${className}`}
    >
      <div className={`${classes.container} text-center`}>
        {/* Category Image/Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${classes.image} bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden`}>
            {category.icon ? (
              <img
                src={imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className={`${size === 'small' ? 'h-6 w-6' : size === 'medium' ? 'h-8 w-8' : 'h-10 w-10'} text-blue-600`} />
            )}
          </div>
        </div>

        {/* Category Name */}
        <h3 className={`${classes.title} text-gray-900 group-hover:text-blue-600 transition-colors mb-2`}>
          {category.name}
        </h3>

        {/* Category Description */}
        {category.description && size !== 'small' && (
          <p className={`${classes.description} text-gray-600 line-clamp-2 mb-3`}>
            {category.description}
          </p>
        )}

        {/* Product Count */}
        {showProductCount && (
          <div className={`${classes.count} text-gray-500 flex items-center justify-center`}>
            <Package className={`${size === 'small' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
            {category.product_count || 0} produk
          </div>
        )}

        {/* Hover Arrow */}
        <div className="mt-4 flex justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className={`${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;