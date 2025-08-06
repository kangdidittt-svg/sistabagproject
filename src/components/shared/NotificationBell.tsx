import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertTriangle, Package, X } from 'lucide-react';
import LocalStorageService from '../../services/localStorage';
import { Product } from '../../services/api';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotifications = () => {
      try {
        const products = LocalStorageService.getProducts();
        
        // Get custom threshold from localStorage, default to 5
        const savedThreshold = localStorage.getItem('lowStockThreshold');
        const threshold = savedThreshold ? parseInt(savedThreshold) : 5;
        
        const lowStock = products.filter(product => product.stock < threshold);
        setLowStockProducts(lowStock);
        
        // Check if there are new notifications (for demo purposes, always show as new)
        setHasNewNotifications(lowStock.length > 0);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && hasNewNotifications) {
      setHasNewNotifications(false);
    }
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= 2) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getStockStatusText = (stock: number) => {
    if (stock === 0) return 'Habis';
    if (stock === 1) return '1 tersisa';
    return `${stock} tersisa`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        
        {/* Notification Badge */}
        {lowStockProducts.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            {lowStockProducts.length > 9 ? '9+' : lowStockProducts.length}
          </span>
        )}
        
        {/* New Notification Indicator */}
        {hasNewNotifications && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Notifikasi Stok
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {lowStockProducts.length > 0 ? (
              <div className="p-2">
                {lowStockProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/admin/products/edit/${product._id}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          product.stock === 0 
                            ? 'bg-red-100' 
                            : product.stock <= 2 
                            ? 'bg-red-100' 
                            : 'bg-yellow-100'
                        }`}>
                          <Package className={`h-4 w-4 ${
                            product.stock === 0 
                              ? 'text-red-600' 
                              : product.stock <= 2 
                              ? 'text-red-600' 
                              : 'text-yellow-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className={`text-sm font-medium ${getStockStatusColor(product.stock)}`}>
                          {getStockStatusText(product.stock)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Kategori: {product.category.name}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`text-lg font-bold ${getStockStatusColor(product.stock)}`}>
                          {product.stock}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada notifikasi stok rendah</p>
                <p className="text-sm text-gray-400 mt-1">Semua produk memiliki stok yang cukup</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {lowStockProducts.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Link
                to="/admin/products?filter=low-stock"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lihat Semua Produk Stok Rendah
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;