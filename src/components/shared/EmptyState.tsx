import React from 'react';
import { Package, Search, ShoppingBag, Tag, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'products' | 'search' | 'categories' | 'promos' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'general',
  title,
  description,
  actionText,
  onAction,
  className = '',
  size = 'medium'
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'products':
        return {
          icon: Package,
          title: 'Belum Ada Produk',
          description: 'Produk belum tersedia saat ini. Silakan coba lagi nanti atau jelajahi kategori lain.',
          actionText: 'Jelajahi Kategori'
        };
      case 'search':
        return {
          icon: Search,
          title: 'Tidak Ada Hasil',
          description: 'Pencarian Anda tidak menemukan hasil. Coba gunakan kata kunci yang berbeda atau periksa ejaan.',
          actionText: 'Reset Pencarian'
        };
      case 'categories':
        return {
          icon: ShoppingBag,
          title: 'Belum Ada Kategori',
          description: 'Kategori produk belum tersedia. Silakan kembali lagi nanti.',
          actionText: 'Kembali ke Beranda'
        };
      case 'promos':
        return {
          icon: Tag,
          title: 'Belum Ada Promo',
          description: 'Saat ini belum ada promo yang tersedia. Pantau terus untuk penawaran menarik!',
          actionText: 'Lihat Produk'
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Tidak Ada Data',
          description: 'Data yang Anda cari tidak tersedia saat ini.',
          actionText: 'Muat Ulang'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const Icon = defaultContent.icon;

  const sizeClasses = {
    small: {
      container: 'py-8',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    medium: {
      container: 'py-12',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-6 py-3 text-base'
    },
    large: {
      container: 'py-16',
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-8 py-4 text-lg'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${classes.container} ${className}`}>
      {/* Icon */}
      <div className="mb-6">
        <div className="mx-auto bg-gray-100 rounded-full p-6 w-fit">
          <Icon className={`${classes.icon} text-gray-400`} />
        </div>
      </div>

      {/* Title */}
      <h3 className={`${classes.title} font-semibold text-gray-900 mb-2`}>
        {title || defaultContent.title}
      </h3>

      {/* Description */}
      <p className={`${classes.description} text-gray-600 max-w-md mb-6`}>
        {description || defaultContent.description}
      </p>

      {/* Action Button */}
      {(onAction || actionText) && (
        <button
          onClick={onAction}
          className={`
            ${classes.button} bg-blue-600 text-white font-medium rounded-lg
            hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:ring-offset-2
          `}
        >
          {actionText || defaultContent.actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;