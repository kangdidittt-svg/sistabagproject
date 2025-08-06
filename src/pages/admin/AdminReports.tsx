import React, { useState, useEffect } from 'react';
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  items_sold: number;
}

interface ProductSalesData {
  product_id: string;
  product_name: string;
  quantity: number;
  revenue: number;
  category: string;
}

interface CategorySalesData {
  category_id: string;
  category_name: string;
  quantity: number;
  revenue: number;
  product_count: number;
}

const AdminReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'sales' | 'products' | 'categories'>('sales');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productSalesData, setProductSalesData] = useState<ProductSalesData[]>([]);
  const [categorySalesData, setCategorySalesData] = useState<CategorySalesData[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Summary metrics
  const [summaryMetrics, setSummaryMetrics] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_items_sold: 0,
    average_order_value: 0
  });

  useEffect(() => {
    // Set default dates based on selected range
    const today = new Date();
    let start = new Date();
    
    switch(dateRange) {
      case 'today':
        // Start and end are both today
        break;
      case 'week':
        // Start is 7 days ago
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        // Start is 30 days ago
        start.setDate(today.getDate() - 30);
        break;
      case 'year':
        // Start is 365 days ago
        start.setDate(today.getDate() - 365);
        break;
      case 'custom':
        // Use the custom dates set by user
        return;
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, [dateRange]);

  useEffect(() => {
    fetchReportData();
  }, [reportType, startDate, endDate]);

  const fetchReportData = async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    try {
      // Mock data generation based on report type
      if (reportType === 'sales') {
        const mockSalesData = generateMockSalesData(startDate, endDate);
        setSalesData(mockSalesData);
        
        // Calculate summary metrics
        const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0);
        const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
        const totalItemsSold = mockSalesData.reduce((sum, item) => sum + item.items_sold, 0);
        
        setSummaryMetrics({
          total_revenue: totalRevenue,
          total_orders: totalOrders,
          total_items_sold: totalItemsSold,
          average_order_value: totalOrders > 0 ? totalRevenue / totalOrders : 0
        });
      } 
      else if (reportType === 'products') {
        const mockProductData = generateMockProductSalesData();
        setProductSalesData(mockProductData);
      } 
      else if (reportType === 'categories') {
        const mockCategoryData = generateMockCategorySalesData();
        setCategorySalesData(mockCategoryData);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock sales data
  const generateMockSalesData = (start: string, end: string): SalesData[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const data: SalesData[] = [];
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Generate random data for each day
      const orders = Math.floor(Math.random() * 20) + 1;
      const itemsPerOrder = Math.floor(Math.random() * 3) + 1;
      const itemsSold = orders * itemsPerOrder;
      const avgPrice = Math.floor(Math.random() * 100000) + 50000;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        revenue: orders * avgPrice,
        orders: orders,
        items_sold: itemsSold
      });
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  // Helper function to generate mock product sales data
  const generateMockProductSalesData = (): ProductSalesData[] => {
    const products = [
      { id: '1', name: 'Smartphone X', category: 'Elektronik' },
      { id: '2', name: 'Laptop Pro', category: 'Elektronik' },
      { id: '3', name: 'Kemeja Formal', category: 'Fashion' },
      { id: '4', name: 'Celana Jeans', category: 'Fashion' },
      { id: '5', name: 'Snack Box', category: 'Makanan & Minuman' },
      { id: '6', name: 'Minuman Soda', category: 'Makanan & Minuman' },
      { id: '7', name: 'Headphone', category: 'Elektronik' },
      { id: '8', name: 'Dress Casual', category: 'Fashion' },
      { id: '9', name: 'Kopi Sachet', category: 'Makanan & Minuman' },
      { id: '10', name: 'Power Bank', category: 'Elektronik' },
    ];
    
    return products.map(product => ({
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      quantity: Math.floor(Math.random() * 100) + 10,
      revenue: Math.floor(Math.random() * 10000000) + 500000
    }));
  };

  // Helper function to generate mock category sales data
  const generateMockCategorySalesData = (): CategorySalesData[] => {
    const categories = [
      { id: '1', name: 'Elektronik', productCount: 25 },
      { id: '2', name: 'Fashion', productCount: 30 },
      { id: '3', name: 'Makanan & Minuman', productCount: 15 },
      { id: '4', name: 'Perabotan Rumah', productCount: 20 },
      { id: '5', name: 'Kesehatan & Kecantikan', productCount: 18 },
    ];
    
    return categories.map(category => ({
      category_id: category.id,
      category_name: category.name,
      product_count: category.productCount,
      quantity: Math.floor(Math.random() * 500) + 50,
      revenue: Math.floor(Math.random() * 50000000) + 5000000
    }));
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Handle export to CSV
  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';
    
    if (reportType === 'sales') {
      // Headers
      csvContent = 'Tanggal,Pendapatan,Pesanan,Item Terjual\n';
      
      // Data rows
      salesData.forEach(row => {
        csvContent += `${row.date},${row.revenue},${row.orders},${row.items_sold}\n`;
      });
      
      filename = `laporan_penjualan_${startDate}_${endDate}.csv`;
    } 
    else if (reportType === 'products') {
      // Headers
      csvContent = 'Produk,Kategori,Kuantitas,Pendapatan\n';
      
      // Data rows
      productSalesData.forEach(row => {
        csvContent += `"${row.product_name}","${row.category}",${row.quantity},${row.revenue}\n`;
      });
      
      filename = `laporan_produk_${startDate}_${endDate}.csv`;
    } 
    else if (reportType === 'categories') {
      // Headers
      csvContent = 'Kategori,Jumlah Produk,Kuantitas Terjual,Pendapatan\n';
      
      // Data rows
      categorySalesData.forEach(row => {
        csvContent += `"${row.category_name}",${row.product_count},${row.quantity},${row.revenue}\n`;
      });
      
      filename = `laporan_kategori_${startDate}_${endDate}.csv`;
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => fetchReportData()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Report Type Selector */}
          <div className="w-full sm:w-auto">
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Laporan
            </label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="sales">Laporan Penjualan</option>
              <option value="products">Laporan Produk</option>
              <option value="categories">Laporan Kategori</option>
            </select>
          </div>

          {/* Date Range Selector */}
          <div className="w-full sm:w-auto">
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
              Rentang Waktu
            </label>
            <select
              id="date-range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
              <option value="year">1 Tahun Terakhir</option>
              <option value="custom">Kustom</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="w-full sm:w-auto flex space-x-2 items-end">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Akhir
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Apply Filter Button */}
          {dateRange === 'custom' && (
            <div className="w-full sm:w-auto flex items-end">
              <button
                onClick={fetchReportData}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Terapkan Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" text="Memuat data..." />
        </div>
      )}

      {/* Report Content */}
      {!loading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          {reportType === 'sales' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Pendapatan</dt>
                        <dd className="text-lg font-semibold text-gray-900">{formatCurrency(summaryMetrics.total_revenue)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Pesanan</dt>
                        <dd className="text-lg font-semibold text-gray-900">{summaryMetrics.total_orders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Item Terjual</dt>
                        <dd className="text-lg font-semibold text-gray-900">{summaryMetrics.total_items_sold}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Rata-rata Nilai Pesanan</dt>
                        <dd className="text-lg font-semibold text-gray-900">{formatCurrency(summaryMetrics.average_order_value)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Sales Report */}
            {reportType === 'sales' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pendapatan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pesanan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Terjual
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.items_sold}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Products Report */}
            {reportType === 'products' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produk
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kuantitas Terjual
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pendapatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productSalesData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Categories Report */}
            {reportType === 'categories' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Produk
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kuantitas Terjual
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pendapatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categorySalesData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.product_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;