import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { Promo } from '../../services/api';
import PromoCard from './PromoCard';

interface PromoSliderProps {
  promos: Promo[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const PromoSlider: React.FC<PromoSliderProps> = ({
  promos,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || promos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === promos.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, promos.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? promos.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === promos.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (promos.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 bg-gradient-to-r from-pink-50 to-rose-50 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Tag className="h-6 w-6 text-rose-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              Promo Spesial
            </h2>
          </div>
          <Link
            to="/promos"
            className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors"
          >
            Lihat Semua
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Slider Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Slider Wrapper */}
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {promos.map((promo) => (
                <div key={promo._id} className="w-full flex-shrink-0">
                  <div className="px-2">
                    <PromoCard
                      promo={promo}
                      size="small"
                      layout="banner"
                      className="h-32"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {promos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-md transition-all duration-200 z-10"
                aria-label="Previous promo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-md transition-all duration-200 z-10"
                aria-label="Next promo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {promos.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {promos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-rose-500 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to promo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoSlider;