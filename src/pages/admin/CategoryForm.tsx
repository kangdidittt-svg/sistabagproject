import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, X } from 'lucide-react';
import { Category } from '../../services/api';
import { LoadingSpinner } from '../../components/shared';
import { LocalStorageService } from '../../services/localStorage';

interface CategoryFormProps {
  isEditing?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    icon: ''
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && id) {
        setLoading(true);
        try {
          // Mock category data for editing
          const mockCategory: Category = {
            _id: id,
            name: 'Elektronik',
            slug: 'elektronik',
            description: 'Produk elektronik seperti smartphone, laptop, dan gadget lainnya',
            icon: '',
            product_count: 25,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          };

          setFormData(mockCategory);
        } catch (error) {
          console.error('Error fetching category:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIconFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setIconPreview(previewUrl);
    }
  };

  const removeIcon = () => {
    setIconFile(null);
    
    // Revoke the URL to avoid memory leaks
    if (iconPreview) {
      URL.revokeObjectURL(iconPreview);
      setIconPreview('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Nama kategori wajib diisi';
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
      if (isEditing && id) {
        // Update existing category
        LocalStorageService.updateCategory(id, formData);
        console.log('Category updated:', formData);
      } else {
        // Create new category
        const newCategory = LocalStorageService.saveCategory(formData);
        console.log('Category created:', newCategory);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect after successful save
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Terjadi kesalahan saat menyimpan kategori');
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
            onClick={() => navigate('/admin/categories')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h1>
        </div>
        <div className="flex space-x-3">
          {isEditing && (
            <button
              onClick={() => {
                if (window.confirm('Hapus kategori ini? Semua produk dalam kategori ini akan dipindahkan ke kategori lain.')) {
                  // Implement delete logic
                  navigate('/admin/categories');
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Kategori</h3>
              <p className="mt-1 text-sm text-gray-500">
                Informasi dasar tentang kategori yang akan ditampilkan kepada pelanggan.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama Kategori*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Deskripsi
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
                  Deskripsi singkat tentang kategori ini dan jenis produk yang termasuk di dalamnya.
                </p>
              </div>
            </div>
          </div>

          {/* Icon */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Ikon Kategori</h3>
              <p className="mt-1 text-sm text-gray-500">
                Unggah ikon untuk kategori ini (opsional).
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <label htmlFor="icon-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Unggah Ikon
                  <input
                    id="icon-upload"
                    name="icon"
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="sr-only"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  JPG, PNG, atau SVG hingga 2MB
                </p>
              </div>

              {iconPreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 overflow-hidden rounded-lg bg-gray-100">
                      <img src={iconPreview} alt="Icon Preview" className="object-cover w-full h-full" />
                    </div>
                    <button
                      type="button"
                      onClick={removeIcon}
                      className="absolute top-1 right-1 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
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

export default CategoryForm;