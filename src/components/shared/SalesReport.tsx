import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package2, TrendingUp, Calendar } from 'lucide-react';
import LocalStorageService from '../../services/localStorage';
import { Product } from '../../services/api';

interface SalesReportProps {
  className?: string;
}

interface SalesData {
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

const SalesReport: React.FC<SalesReportProps> = ({ className = '' }) => {
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalItemsSold: 0,
    averageOrderValue: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateSalesData = () => {
      try {
        const products = LocalStorageService.getProducts();
        
        let totalRevenue = 0;
        let totalItemsSold = 0;
        let totalOrders = 0;
        
        // Hitung total dari semua produk yang memiliki data sales
        products.forEach(product => {
          if (product.sales && product.sales > 0) {
            const productRevenue = product.price * product.sales;
            totalRevenue += productRevenue;
            totalItemsSold += product.sales;
            
            // Asumsi setiap item terjual = 1 pesanan (bisa disesuaikan dengan logika bisnis)
            totalOrders += product.sales;
          }
        });
        
        // Hitung rata-rata nilai pesanan
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Mock monthly growth (dalam implementasi nyata, ini akan dibandingkan dengan data bulan sebelumnya)
        const monthlyGrowth = Math.random() * 20 + 5; // Random 5-25% untuk demo
        
        setSalesData({
          totalRevenue,
          totalOrders,
          totalItemsSold,
          averageOrderValue,
          monthlyGrowth
        });
      } catch (error) {
        console.error('Error calculating sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateSalesData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Total Pendapatan */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(salesData.totalRevenue)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+{salesData.monthlyGrowth.toFixed(1)}%</span>
          <span className="text-gray-600 ml-1">dari bulan lalu</span>
        </div>
      </div>

      {/* Total Pesanan */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(salesData.totalOrders)}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-600">Bulan ini</span>
        </div>
      </div>

      {/* Item Terjual */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Item Terjual</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(salesData.totalItemsSold)}
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <Package2 className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-gray-600">Total unit terjual</span>
        </div>
      </div>

      {/* Rata-rata Nilai Pesanan */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Rata-rata Pesanan</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(salesData.averageOrderValue)}
            </p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-gray-600">Per pesanan</span>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;