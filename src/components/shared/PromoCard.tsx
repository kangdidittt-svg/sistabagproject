import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight, Clock, Percent } from 'lucide-react';
import { Promo } from '../../services/api';

interface PromoCardProps {
  promo: Promo;
  size?: 'small' | 'medium' | 'large';
  layout?: 'card' | 'banner';
  className?: string;
}

const PromoCard: React.FC<PromoCardProps> = ({
  promo,
  size = 'medium',
  layout = 'card',
  className = ''
}) => {
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

  const getPromoStatus = () => {
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);

    if (now < startDate) {
      return { status: 'upcoming', label: 'Akan Datang', color: 'bg-yellow-500' };
    } else if (now > endDate) {
      return { status: 'expired', label: 'Berakhir', color: 'bg-gray-500' };
    } else {
      return { status: 'active', label: 'Aktif', color: 'bg-green-500' };
    }
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const endDate = new Date(promo.end_date);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const promoStatus = getPromoStatus();
  const daysRemaining = getDaysRemaining();
  const imageUrl = promo.image || `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(promo.title.toLowerCase().replace(/\s+/g, '%20') + '%20promotion%20banner')}&image_size=landscape_16_9`;

  if (layout === 'banner') {
    return (
      <div className={`relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Status Badge */}
              <div className="flex items-center space-x-2 mb-4">
                <span className={`${promoStatus.color} text-white text-xs px-3 py-1 rounded-full`}>
                  {promoStatus.label}
                </span>
                {promoStatus.status === 'active' && daysRemaining > 0 && (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {daysRemaining} hari lagi
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-2">{promo.title}</h2>
              
              {/* Description */}
              <p className="text-blue-100 mb-4 max-w-md">{promo.description}</p>

              {/* Discount */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <Percent className="h-5 w-5 mr-2" />
                    <span className="text-xl font-bold">{promo.discount_percentage}%</span>
                  </div>
                  <div className="text-xs text-blue-100">Diskon</div>
                </div>
                {promo.max_discount && (
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <div className="text-lg font-bold">{formatPrice(promo.max_discount)}</div>
                    <div className="text-xs text-blue-100">Maks. Diskon</div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                to={`/catalog?categories=${promo.applicable_categories?.map(cat => typeof cat === 'string' ? cat : cat._id).join(',')}`}
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Lihat Produk
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Image */}
            <div className="hidden md:block w-64 h-32">
              <img
                src={imageUrl}
                alt={promo.title}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    small: {
      container: 'p-4',
      image: 'h-32',
      title: 'text-sm font-medium',
      description: 'text-xs',
      discount: 'text-lg'
    },
    medium: {
      container: 'p-6',
      image: 'h-40',
      title: 'text-lg font-semibold',
      description: 'text-sm',
      discount: 'text-xl'
    },
    large: {
      container: 'p-8',
      image: 'h-48',
      title: 'text-xl font-bold',
      description: 'text-base',
      discount: 'text-2xl'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {/* Image */}
      <div className={`${classes.image} bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden`}>
        <img
          src={imageUrl}
          alt={promo.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`${promoStatus.color} text-white text-xs px-2 py-1 rounded-full`}>
            {promoStatus.label}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-bold">{promo.discount_percentage}%</div>
            <div className="text-xs">OFF</div>
          </div>
        </div>

        {/* Days Remaining */}
        {promoStatus.status === 'active' && daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {daysRemaining} hari lagi
          </div>
        )}
      </div>

      {/* Content */}
      <div className={classes.container}>
        {/* Title */}
        <h3 className={`${classes.title} text-gray-900 mb-2 line-clamp-2`}>
          {promo.title}
        </h3>

        {/* Description */}
        <p className={`${classes.description} text-gray-600 line-clamp-2 mb-3`}>
          {promo.description}
        </p>

        {/* Discount Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Diskon hingga:</span>
            <span className={`${classes.discount} font-bold text-red-600`}>
              {promo.discount_percentage}%
            </span>
          </div>
          {promo.max_discount && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Maks. diskon:</span>
              <span className="font-medium text-gray-900">
                {formatPrice(promo.max_discount)}
              </span>
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="text-xs text-gray-500 mb-4 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(promo.start_date)} - {formatDate(promo.end_date)}
        </div>

        {/* Categories */}
        {promo.applicable_categories && promo.applicable_categories.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {promo.applicable_categories.slice(0, 3).map((category) => (
                <span key={category._id} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {category.name}
                </span>
              ))}
              {promo.applicable_categories.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{promo.applicable_categories.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/catalog?categories=${promo.applicable_categories?.map(cat => typeof cat === 'string' ? cat : cat._id).join(',')}`}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Tag className="h-4 w-4 mr-2" />
          Lihat Produk Promo
        </Link>
      </div>
    </div>
  );
};

export default PromoCard;