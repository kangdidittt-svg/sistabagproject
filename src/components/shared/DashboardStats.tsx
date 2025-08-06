import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Eye, AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import LocalStorageService from '../../services/localStorage';
import { Product } from '../../services/api';

interface DashboardStatsProps {
  className?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ className = '' }) => {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [mostViewedProducts, setMostViewedProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        const products = LocalStorageService.getProducts();
        
        // Produk terlaris (berdasarkan sales)
        const bestSelling = products
          .filter(product => product.sales && product.sales > 0)
          .sort((a, b) => (b.sales || 0) - (a.sales || 0))
          .slice(0, 5);
        
        // Produk paling banyak dilihat (berdasarkan views)
        const mostViewed = products
          .filter(product => product.views && product.views > 0)
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);
        
        // Produk dengan stok rendah (< 5)
        const lowStock = products
          .filter(product => product.stock < 5)
          .sort((a, b) => a.stock - b.stock);
        
        setBestSellingProducts(bestSelling);
        setMostViewedProducts(mostViewed);
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Produk Terlaris */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Produk Terlaris
            </h3>
            <Link 
              to="/admin/products?sort=sales" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
        <div className="p-6">
          {bestSellingProducts.length > 0 ? (
            <div className="space-y-4">
              {bestSellingProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/admin/products/edit/${product._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <ShoppingCart className="h-3 w-3" />
                      <span>{formatNumber(product.sales || 0)} terjual</span>
                      <span>•</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(product.sales || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada data penjualan</p>
            </div>
          )}
        </div>
      </div>

      {/* Produk Paling Banyak Dilihat */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye className="h-5 w-5 text-blue-600 mr-2" />
              Paling Banyak Dilihat
            </h3>
            <Link 
              to="/admin/products?sort=views" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
        <div className="p-6">
          {mostViewedProducts.length > 0 ? (
            <div className="space-y-4">
              {mostViewedProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/admin/products/edit/${product._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(product.views || 0)} views</span>
                      <span>•</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(product.views || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada data views</p>
            </div>
          )}
        </div>
      </div>

      {/* Notifikasi Stok Rendah */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Stok Rendah
              {lowStockProducts.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {lowStockProducts.length}
                </span>
              )}
            </h3>
            <Link 
              to="/admin/products?filter=low-stock" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
        <div className="p-6">
          {lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      product.stock === 0 
                        ? 'bg-red-100' 
                        : product.stock <= 2 
                        ? 'bg-red-100' 
                        : 'bg-yellow-100'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        product.stock === 0 
                          ? 'text-red-600' 
                          : product.stock <= 2 
                          ? 'text-red-600' 
                          : 'text-yellow-600'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/admin/products/edit/${product._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Package className="h-3 w-3" />
                      <span className={`font-medium ${
                        product.stock === 0 
                          ? 'text-red-600' 
                          : product.stock <= 2 
                          ? 'text-red-600' 
                          : 'text-yellow-600'
                      }`}>
                        {product.stock === 0 ? 'Habis' : `${product.stock} tersisa`}
                      </span>
                      <span>•</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-sm font-bold ${
                      product.stock === 0 
                        ? 'text-red-600' 
                        : product.stock <= 2 
                        ? 'text-red-600' 
                        : 'text-yellow-600'
                    }`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Semua produk stok aman</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;