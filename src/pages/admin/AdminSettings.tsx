import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, Trash2, Plus, RefreshCw, User, Lock, Eye, EyeOff } from 'lucide-react';
import { LoadingSpinner } from '../../components/shared';

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  last_login?: string;
  created_at: string;
}

const AdminSettings: React.FC = () => {
  // Backup state
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  
  // User management state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Notification settings state
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    whatsappNotifications: false,
    dailyReport: false
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // New user form state
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as const
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    // Fetch backup info and users on component mount
    fetchBackupInfo();
    fetchUsers();
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = () => {
    try {
      const savedThreshold = localStorage.getItem('lowStockThreshold');
      const savedSettings = localStorage.getItem('notificationSettings');
      const savedWhatsappNumber = localStorage.getItem('whatsappNumber');
      
      if (savedThreshold) {
        setLowStockThreshold(parseInt(savedThreshold));
      }
      
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      }
      
      if (savedWhatsappNumber) {
        setWhatsappNumber(savedWhatsappNumber);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async () => {
    setSettingsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('lowStockThreshold', lowStockThreshold.toString());
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('whatsappNumber', whatsappNumber);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert('Pengaturan notifikasi berhasil disimpan!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Gagal menyimpan pengaturan notifikasi.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleNotificationSettingChange = (key: string, value?: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key as keyof typeof prev]
    }));
  };

  const fetchBackupInfo = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock last backup date
      setLastBackupDate('2024-05-15T10:30:00Z');
    } catch (error) {
      console.error('Error fetching backup info:', error);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock users data
      const mockUsers: AdminUser[] = [
        {
          _id: '1',
          username: 'admin',
          email: 'admin@sistabagg.com',
          role: 'super_admin',
          last_login: '2024-05-20T08:45:00Z',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          _id: '2',
          username: 'manager',
          email: 'manager@sistabagg.com',
          role: 'admin',
          last_login: '2024-05-19T14:30:00Z',
          created_at: '2024-02-15T10:00:00Z'
        },
        {
          _id: '3',
          username: 'staff',
          email: 'staff@sistabagg.com',
          role: 'admin',
          last_login: '2024-05-18T09:15:00Z',
          created_at: '2024-03-10T11:30:00Z'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setBackupLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last backup date
      const now = new Date().toISOString();
      setLastBackupDate(now);
      
      // Trigger download
      const backupData = {
        timestamp: now,
        data: 'This is a mock backup file'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sistabagg_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Backup berhasil dibuat dan diunduh!');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Terjadi kesalahan saat membuat backup');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setRestoreLoading(true);
    
    try {
      // Read file
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== 'string') return;
        
        try {
          // Parse JSON
          const backupData = JSON.parse(event.target.result);
          
          // Mock restore process
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          alert('Backup berhasil dipulihkan!');
          // Refresh data
          fetchBackupInfo();
          fetchUsers();
        } catch (parseError) {
          console.error('Error parsing backup file:', parseError);
          alert('File backup tidak valid');
        } finally {
          setRestoreLoading(false);
        }
      };
      
      reader.onerror = () => {
        alert('Gagal membaca file');
        setRestoreLoading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Terjadi kesalahan saat memulihkan backup');
      setRestoreLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newUser.username.trim()) {
      errors.username = 'Username wajib diisi';
    }
    
    if (!newUser.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!newUser.password) {
      errors.password = 'Password wajib diisi';
    } else if (newUser.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password tidak cocok';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setAddingUser(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add user to list (in a real app, this would come from the API response)
      const newUserData: AdminUser = {
        _id: Date.now().toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        created_at: new Date().toISOString()
      };
      
      setUsers(prev => [newUserData, ...prev]);
      
      // Reset form
      setNewUser({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin'
      });
      
      setShowAddUserForm(false);
      alert('User admin berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Terjadi kesalahan saat menambahkan user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Hapus user ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove user from list
      setUsers(prev => prev.filter(user => user._id !== userId));
      
      alert('User berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Terjadi kesalahan saat menghapus user');
    }
  };

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
      </div>

      {/* Notification Settings Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Pengaturan Notifikasi</h3>
          <p className="mt-1 text-sm text-gray-500">
            Atur notifikasi untuk stok rendah dan pengaturan lainnya.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Low Stock Threshold */}
            <div>
              <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
                Batas Minimal Stok Rendah
              </label>
              <div className="mt-1 flex items-center space-x-3">
                <input
                  type="number"
                  id="lowStockThreshold"
                  min="1"
                  max="50"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 1)}
                  className="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="text-sm text-gray-500">
                  unit (produk dengan stok di bawah angka ini akan muncul notifikasi)
                </span>
              </div>
            </div>

             {/* WhatsApp Number */}
             <div>
               <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                 Nomor WhatsApp
               </label>
               <div className="mt-1">
                 <input
                   type="tel"
                   id="whatsappNumber"
                   placeholder="Contoh: +6281234567890"
                   value={whatsappNumber}
                   onChange={(e) => setWhatsappNumber(e.target.value)}
                   className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                 />
                 <p className="mt-1 text-sm text-gray-500">
                   Masukkan nomor WhatsApp dengan kode negara (contoh: +6281234567890)
                 </p>
               </div>
             </div>

             {/* Notification Types */}
             <div>
               <h4 className="text-base font-medium text-gray-900 mb-4">Jenis Notifikasi</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notifikasi Email</span>
                    <p className="text-sm text-gray-500">Kirim email ketika ada produk dengan stok rendah</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationSettingChange('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notifikasi Browser</span>
                    <p className="text-sm text-gray-500">Tampilkan notifikasi di browser admin</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationSettingChange('browserNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationSettings.browserNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.browserNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Notifikasi WhatsApp</span>
                    <p className="text-sm text-gray-500">Kirim notifikasi via WhatsApp</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationSettingChange('whatsappNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationSettings.whatsappNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.whatsappNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Laporan Harian</span>
                    <p className="text-sm text-gray-500">Kirim laporan stok harian via email</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationSettingChange('dailyReport')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      notificationSettings.dailyReport ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.dailyReport ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={saveNotificationSettings}
                disabled={settingsLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
              >
                {settingsLoading ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Pengaturan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Restore Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Backup & Restore</h3>
          <p className="mt-1 text-sm text-gray-500">
            Buat cadangan data atau pulihkan dari file backup sebelumnya.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-gray-900">Backup Database</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Backup terakhir: {lastBackupDate ? formatDate(lastBackupDate) : 'Belum pernah'}
                </p>
              </div>
              <button
                onClick={handleCreateBackup}
                disabled={backupLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
              >
                {backupLoading ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    Membuat Backup...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Buat Backup
                  </>
                )}
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Pulihkan dari Backup</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Pilih file backup untuk memulihkan data.
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    id="restore-file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    disabled={restoreLoading}
                    className="sr-only"
                  />
                  <label
                    htmlFor="restore-file"
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${restoreLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {restoreLoading ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        Memulihkan...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Pilih File Backup
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Manajemen User Admin</h3>
            <p className="mt-1 text-sm text-gray-500">
              Kelola user yang memiliki akses ke panel admin.
            </p>
          </div>
          <button
            onClick={() => setShowAddUserForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah User
          </button>
        </div>

        {/* Add User Form */}
        {showAddUserForm && (
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={newUser.username}
                      onChange={handleInputChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.username ? 'border-red-300' : ''}`}
                    />
                    {formErrors.username && <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.email ? 'border-red-300' : ''}`}
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password*
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className={`pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.password ? 'border-red-300' : ''}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Konfirmasi Password*
                  </label>
                  <div className="mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={handleInputChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${formErrors.confirmPassword ? 'border-red-300' : ''}`}
                    />
                    {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={newUser.role}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {addingUser ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="px-4 py-5 sm:p-6">
          {usersLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="large" text="Memuat data..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Login Terakhir
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibuat Pada
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.role !== 'super_admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;