import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../services/api';
import { LocalStorageService } from '../../services/localStorage';

interface FeaturedProductsSliderProps {
  autoSlide?: boolean;
  slideInterval?: number;
}

export default function FeaturedProductsSlider({ 
  autoSlide = true, 
  slideInterval = 4000 
}: FeaturedProductsSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load featured products from localStorage
    const loadFeaturedProducts = () => {
      try {
        const allProducts = LocalStorageService.getProducts();
        // Filter products that are marked as featured or get top 6 products
        const featured = allProducts
          .filter(product => product.is_featured || (product.rating && product.rating >= 4.5))
          .slice(0, 6);
        
        // If no featured products, get top 6 by rating
        if (featured.length === 0) {
          const topRated = allProducts
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 6);
          setFeaturedProducts(topRated);
        } else {
          setFeaturedProducts(featured);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    if (!autoSlide || featuredProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredProducts.length - 1 ? 0 : prev + 1
      );
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === featuredProducts.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredProducts.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produk Unggulan</h2>
        <p className="text-gray-600">Produk terbaik pilihan kami untuk Anda</p>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-lg">
        {/* Slides */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredProducts.map((product, index) => (
            <div key={product._id} className="w-full flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mx-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* Product Image */}
                  <div className="relative group">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating!)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.rating})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {product.discount ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-blue-600">
                            Rp {(product.price * (1 - product.discount / 100)).toLocaleString('id-ID')}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        to={`/product/${product.slug}`}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Lihat Detail</span>
                      </Link>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {featuredProducts.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {featuredProducts.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}