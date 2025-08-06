import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Calendar, Tag, Percent } from 'lucide-react';
import { Promo, Category } from '../../services/api';
import { LoadingSpinner } from '../../components/shared';
import { LocalStorageService } from '../../services/localStorage';

interface PromoFormProps {
  isEditing?: boolean;
}

const PromoForm: React.FC<PromoFormProps> = ({ isEditing: propIsEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Promo>>({
    title: '',
    description: '',
    discount_percentage: 0,
    start_date: '',
    end_date: '',
    is_active: false,
    max_discount: 0,
    applicable_categories: []
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Determine if we're in edit mode based on URL parameter
  const isEditing = propIsEditing || !!id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load categories from localStorage
        const categoriesData = LocalStorageService.getCategories();
        setCategories(categoriesData);

        if (isEditing && id) {
          // Load promo data for editing
          const promos = LocalStorageService.getPromos();
          const existingPromo = promos.find(p => p._id === id);
          
          if (existingPromo) {
            // Format dates for form inputs
            const formattedPromo = {
              ...existingPromo,
              start_date: existingPromo.start_date.split('T')[0],
              end_date: existingPromo.end_date.split('T')[0]
            };
            
            setFormData(formattedPromo);
            
            // Set selected category if exists
            if (existingPromo.applicable_categories && existingPromo.applicable_categories.length > 0) {
              setSelectedCategoryId(existingPromo.applicable_categories[0]._id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (['discount_percentage', 'max_discount'].includes(name)) {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Judul promo wajib diisi';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Deskripsi promo wajib diisi';
    }
    
    if (!formData.discount_percentage || formData.discount_percentage <= 0) {
      newErrors.discount_percentage = 'Persentase diskon harus lebih dari 0';
    }
    
    if (formData.discount_percentage && formData.discount_percentage > 100) {
      newErrors.discount_percentage = 'Persentase diskon tidak boleh lebih dari 100%';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Tanggal mulai wajib diisi';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'Tanggal berakhir wajib diisi';
    }
    
    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      newErrors.end_date = 'Tanggal berakhir harus setelah tanggal mulai';
    }
    
    if (!formData.max_discount || formData.max_discount <= 0) {
      newErrors.max_discount = 'Maksimal diskon harus lebih dari 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    try {
      // Get selected category
      const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
      
      const promoData = {
        ...formData,
        start_date: new Date(formData.start_date!).toISOString(),
        end_date: new Date(formData.end_date!).toISOString(),
        applicable_categories: selectedCategory ? [selectedCategory] : [],
        created_at: isEditing ? formData.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (isEditing && id) {
        // Update existing promo
        LocalStorageService.updatePromo(id, promoData);
        alert('Promo berhasil diperbarui!');
      } else {
        // Create new promo
        const newPromo = LocalStorageService.savePromo(promoData);
        alert('Promo berhasil dibuat!');
      }
      
      // Redirect after successful save
      navigate('/admin/promos');
    } catch (error) {
      console.error('Error saving promo:', error);
      alert('Terjadi kesalahan saat menyimpan promo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Memuat data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/promos')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Promo' : 'Tambah Promo Baru'}
          </h1>
        </div>
        <div className="flex space-x-3">
          {isEditing && (
            <button
              onClick={() => {
                if (window.confirm('Hapus promo ini?')) {
                  // Implement delete logic
                  navigate('/admin/promos');
                }
              }}
              className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2 inline" />
              Hapus
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? (
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
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          {/* Basic Info */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Promo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Informasi dasar tentang promo yang akan ditampilkan kepada pelanggan.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Judul Promo*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.title ? 'border-red-300' : ''}`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Deskripsi*
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.description ? 'border-red-300' : ''}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Deskripsi singkat tentang promo ini yang akan ditampilkan kepada pelanggan.
                </p>
              </div>
            </div>
          </div>

          {/* Discount Details */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Detail Diskon</h3>
              <p className="mt-1 text-sm text-gray-500">
                Informasi tentang nilai diskon dan batasan penggunaan.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700">
                  Persentase Diskon*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Percent className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="discount_percentage"
                    id="discount_percentage"
                    min="1"
                    max="100"
                    value={formData.discount_percentage || ''}
                    onChange={handleInputChange}
                    className={`pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.discount_percentage ? 'border-red-300' : ''}`}
                  />
                  {errors.discount_percentage && <p className="mt-1 text-sm text-red-600">{errors.discount_percentage}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="max_discount" className="block text-sm font-medium text-gray-700">
                  Maksimal Diskon (Rp)*
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="max_discount"
                    id="max_discount"
                    min="0"
                    value={formData.max_discount || ''}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.max_discount ? 'border-red-300' : ''}`}
                  />
                  {errors.max_discount && <p className="mt-1 text-sm text-red-600">{errors.max_discount}</p>}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Batas maksimal nilai diskon dalam rupiah.
                </p>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Periode Promo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tentukan kapan promo ini berlaku.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                  Tanggal Mulai*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="start_date"
                    id="start_date"
                    value={formData.start_date || ''}
                    onChange={handleInputChange}
                    className={`pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.start_date ? 'border-red-300' : ''}`}
                  />
                  {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                  Tanggal Berakhir*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="end_date"
                    id="end_date"
                    value={formData.end_date || ''}
                    onChange={handleInputChange}
                    className={`pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.end_date ? 'border-red-300' : ''}`}
                  />
                  {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Scope */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Cakupan Promo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tentukan apakah promo ini berlaku untuk kategori tertentu atau semua produk.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <div className="mt-1">
                  <select
                    id="category_id"
                    name="category_id"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Pilih kategori tertentu atau biarkan kosong untuk semua kategori.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Status Promo
                </label>
                <div className="mt-1">
                  <div className="flex items-center">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={formData.is_active || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Aktifkan promo
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Centang untuk mengaktifkan promo ini.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/promos')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromoForm;