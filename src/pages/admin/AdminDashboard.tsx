import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardStats, SalesReport } from '../../components/shared';
import { 
  Package, 
  Tag, 
  Percent, 
  Users, 
  TrendingUp, 
  Eye, 
  ShoppingCart,
  Calendar,
  BarChart3,
  Plus,
  Edit,
  Settings
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { admin } = useAuth();

  // Mock statistics data - will be replaced with API calls
  const stats = {
    totalProducts: 156,
    totalCategories: 12,
    activePromos: 8,
    totalViews: 2847,
    monthlyGrowth: 12.5,
    weeklyOrders: 34
  };

  const recentActivities = [
    {
      id: 1,
      type: 'product',
      action: 'Produk baru ditambahkan',
      item: 'Smartphone Android Flagship Premium',
      time: '2 jam yang lalu',
      icon: Package,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 2,
      type: 'promo',
      action: 'Promo diaktifkan',
      item: 'Flash Sale Smartphone - 15% OFF',
      time: '4 jam yang lalu',
      icon: Percent,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'category',
      action: 'Kategori diperbarui',
      item: 'Elektronik',
      time: '1 hari yang lalu',
      icon: Tag,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'product',
      action: 'Produk diedit',
      item: 'Gaming Laptop RTX 4070',
      time: '2 hari yang lalu',
      icon: Edit,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'Tambah Produk',
      description: 'Tambahkan produk baru ke katalog',
      icon: Plus,
      link: '/admin/products/new',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Buat Promo',
      description: 'Buat promo atau diskon baru',
      icon: Percent,
      link: '/admin/promos/new',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Kelola Kategori',
      description: 'Atur kategori produk',
      icon: Tag,
      link: '/admin/categories',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Lihat Laporan',
      description: 'Analisis performa katalog',
      icon: BarChart3,
      link: '/admin/reports',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat datang, {admin?.full_name || admin?.username}!
        </h1>
        <p className="text-gray-600">
          Kelola katalog produk dan pantau performa toko online Anda
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 transition-all duration-200 hover:shadow-sm group"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Produk</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalProducts)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{stats.monthlyGrowth}%</span>
            <span className="text-gray-600 ml-1">dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kategori</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Aktif semua</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promo Aktif</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activePromos}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Percent className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Berlaku hari ini</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Minggu ini</span>
          </div>
        </div>
      </div>

      {/* Sales Report */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Laporan Penjualan</h2>
        <SalesReport />
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`${activity.color} p-2 rounded-lg`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.item}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <Link
                to="/admin/activities"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Lihat semua aktivitas →
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Status Sistem</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Database</span>
                </div>
                <span className="text-sm text-green-600">Online</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">API Server</span>
                </div>
                <span className="text-sm text-green-600">Online</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Storage</span>
                </div>
                <span className="text-sm text-yellow-600">85% Used</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">CDN</span>
                </div>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Backup Terjadwal</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Backup otomatis setiap hari pukul 02:00 WIB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <Eye className="h-4 w-4 mr-2" />
          Lihat Website
        </Link>
        <Link
          to="/admin/settings"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Settings className="h-4 w-4 mr-2" />
          Pengaturan
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;