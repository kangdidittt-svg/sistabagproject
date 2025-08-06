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
    const isCompact = className.includes('h-32'); // Check if it's for slider (compact mode)
    
    return (
      <div className={`relative bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-xl overflow-hidden shadow-lg ${className}`}>
        <div className="absolute inset-0 bg-white bg-opacity-10"></div>
        <div className={`relative text-white ${isCompact ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Status Badge */}
              <div className={`flex items-center space-x-2 ${isCompact ? 'mb-2' : 'mb-3'}`}>
                <span className={`${promoStatus.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                  {promoStatus.label}
                </span>
                {!isCompact && promoStatus.status === 'active' && daysRemaining > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full flex items-center font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    {daysRemaining} hari lagi
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold ${isCompact ? 'mb-1' : 'mb-2'} leading-tight`}>{promo.title}</h2>
              
              {/* Description - Hidden in compact mode */}
              {!isCompact && (
                <p className="text-pink-50 mb-3 max-w-md text-sm leading-relaxed">{promo.description}</p>
              )}

              {/* Discount */}
              <div className={`flex items-center space-x-2 ${isCompact ? 'mb-2' : 'mb-4'}`}>
                <div className="bg-white bg-opacity-25 rounded-lg px-2 py-1 backdrop-blur-sm">
                  <div className="flex items-center">
                    <Percent className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                    <span className={`${isCompact ? 'text-sm' : 'text-lg'} font-bold`}>{promo.discount_percentage}%</span>
                  </div>
                  <div className="text-xs text-pink-100">Diskon</div>
                </div>
                {!isCompact && promo.max_discount && (
                  <div className="bg-white bg-opacity-25 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <div className="text-sm font-bold">{formatPrice(promo.max_discount)}</div>
                    <div className="text-xs text-pink-100">Maks. Diskon</div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                to={`/catalog?categories=${promo.applicable_categories?.map(cat => typeof cat === 'string' ? cat : cat._id).join(',')}`}
                className={`inline-flex items-center bg-white text-rose-600 ${isCompact ? 'px-3 py-1 text-xs' : 'px-5 py-2 text-sm'} rounded-lg font-medium hover:bg-pink-50 transition-all duration-200 shadow-sm`}
              >
                {isCompact ? 'Lihat' : 'Lihat Produk'}
                <ArrowRight className={`${isCompact ? 'h-3 w-3 ml-1' : 'h-4 w-4 ml-1'}`} />
              </Link>
            </div>

            {/* Image - Smaller in compact mode */}
            <div className={`hidden md:block ${isCompact ? 'w-20 h-16' : 'w-48 h-24'}`}>
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
      container: 'p-3',
      image: 'h-28',
      title: 'text-sm font-medium',
      description: 'text-xs',
      discount: 'text-base'
    },
    medium: {
      container: 'p-4',
      image: 'h-32',
      title: 'text-base font-semibold',
      description: 'text-sm',
      discount: 'text-lg'
    },
    large: {
      container: 'p-5',
      image: 'h-36',
      title: 'text-lg font-bold',
      description: 'text-sm',
      discount: 'text-xl'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`group bg-white rounded-xl shadow-sm border border-pink-100 hover:shadow-md hover:border-pink-200 transition-all duration-300 overflow-hidden ${className}`}>
      {/* Image */}
      <div className={`${classes.image} bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 relative overflow-hidden`}>
        <img
          src={imageUrl}
          alt={promo.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`${promoStatus.color} text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm`}>
            {promoStatus.label}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
          <div className="text-center">
            <div className="text-xs font-bold">{promo.discount_percentage}%</div>
            <div className="text-xs">OFF</div>
          </div>
        </div>

        {/* Days Remaining */}
        {promoStatus.status === 'active' && daysRemaining > 0 && daysRemaining <= 7 && (
          <div className="absolute bottom-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-md flex items-center shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            {daysRemaining} hari lagi
          </div>
        )}
      </div>

      {/* Content */}
      <div className={classes.container}>
        {/* Title */}
        <h3 className={`${classes.title} text-gray-800 mb-2 line-clamp-2 leading-tight`}>
          {promo.title}
        </h3>

        {/* Description */}
        <p className={`${classes.description} text-gray-500 line-clamp-2 mb-3 leading-relaxed`}>
          {promo.description}
        </p>

        {/* Discount Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Diskon hingga:</span>
            <span className={`${classes.discount} font-semibold text-rose-600`}>
              {promo.discount_percentage}%
            </span>
          </div>
          {promo.max_discount && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Maks. diskon:</span>
              <span className="font-medium text-gray-800">
                {formatPrice(promo.max_discount)}
              </span>
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="text-xs text-gray-400 mb-4 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(promo.start_date)} - {formatDate(promo.end_date)}
        </div>

        {/* Categories */}
        {promo.applicable_categories && promo.applicable_categories.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {promo.applicable_categories.slice(0, 3).map((category) => (
                <span key={category._id} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                  {category.name}
                </span>
              ))}
              {promo.applicable_categories.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  +{promo.applicable_categories.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/catalog?categories=${promo.applicable_categories?.map(cat => typeof cat === 'string' ? cat : cat._id).join(',')}`}
          className="w-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          <Tag className="h-4 w-4 mr-2" />
          Lihat Produk Promo
        </Link>
      </div>
    </div>
  );
};

export default PromoCard;