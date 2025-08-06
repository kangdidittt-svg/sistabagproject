import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, X } from 'lucide-react';
import { Product, Category } from '../../services/api';
import { LoadingSpinner } from '../../components/shared';
import { LocalStorageService } from '../../services/localStorage';

interface ProductFormProps {
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    original_price: 0,
    category: undefined,
    is_featured: false,
    stock: 0,
    specifications: {}
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load categories from localStorage
        const categories = LocalStorageService.getCategories();
        setCategories(categories);

        // If editing, fetch product data
        if (isEditing && id) {
          // Mock product data for editing
          const mockProduct: Product = {
            _id: id,
            name: 'Smartphone Samsung Galaxy S23',
            slug: 'smartphone-samsung-galaxy-s23',
            description: 'Smartphone flagship dengan kamera canggih',
            price: 12000000,
            original_price: 15000000,
            category: categories[0] || { _id: '1', name: 'Elektronik', slug: 'elektronik', description: '', product_count: 0 },
            is_featured: true,
            stock: 50,
            images: [{ _id: '1', url: '', alt_text: 'Samsung Galaxy S23', is_primary: true }],
            specifications: { 'RAM': '8GB', 'Storage': '256GB', 'Display': '6.1 inch' },
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          };

          setFormData(mockProduct);
          
          // Convert specifications object to array for form
          if (mockProduct.specifications) {
            const specsArray = Object.entries(mockProduct.specifications).map(([key, value]) => ({
              key,
              value: value.toString()
            }));
            setSpecs(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
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
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(cat => cat._id === categoryId);
    
    setFormData(prev => ({
      ...prev,
      category: selectedCategory
    }));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpecField = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    if (specs.length > 1) {
      const newSpecs = specs.filter((_, i) => i !== index);
      setSpecs(newSpecs);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Nama produk wajib diisi';
    }
    
    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }
    
    if (formData.price === undefined || formData.price <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    }
    
    if (formData.stock === undefined || formData.stock < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
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
      // Convert specs array to object
      const specificationsObject: Record<string, string> = {};
      specs.forEach(spec => {
        if (spec.key.trim() && spec.value.trim()) {
          specificationsObject[spec.key.trim()] = spec.value.trim();
        }
      });
      
      const productData = {
        ...formData,
        specifications: specificationsObject
      };
      
      if (isEditing && id) {
        // Update existing product
        LocalStorageService.updateProduct(id, productData);
        console.log('Product updated:', productData);
      } else {
        // Create new product
        const newProduct = LocalStorageService.saveProduct(productData);
        console.log('Product created:', newProduct);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect after successful save
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Terjadi kesalahan saat menyimpan produk');
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
            onClick={() => navigate('/admin/products')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h1>
        </div>
        <div className="flex space-x-3">
          {isEditing && (
            <button
              onClick={() => {
                if (window.confirm('Hapus produk ini?')) {
                  // Implement delete logic
                  navigate('/admin/products');
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">Informasi Dasar</h3>
              <p className="mt-1 text-sm text-gray-500">
                Informasi dasar tentang produk yang akan ditampilkan kepada pelanggan.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama Produk*
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
                  Deskripsi detail tentang produk, fitur, dan manfaatnya.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Kategori*
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category?._id || ''}
                    onChange={handleCategoryChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.category ? 'border-red-300' : ''}`}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="is_featured" className="block text-sm font-medium text-gray-700">
                Unggulan
                  </label>
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      name="is_featured"
                      id="is_featured"
                      checked={formData.is_featured || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Tandai sebagai produk unggulan untuk ditampilkan di halaman utama.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Harga & Inventaris</h3>
              <p className="mt-1 text-sm text-gray-500">
                Informasi tentang harga dan ketersediaan produk.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Harga (Rp)*
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.price ? 'border-red-300' : ''}`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">
                  Harga Asli (Rp) <span className="text-gray-400">(opsional)</span>
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="original_price"
                    id="original_price"
                    min="0"
                    value={formData.original_price || ''}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Harga sebelum diskon, akan ditampilkan sebagai harga coret.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stok*
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    min="0"
                    value={formData.stock || ''}
                    onChange={handleInputChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.stock ? 'border-red-300' : ''}`}
                  />
                  {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Gambar Produk</h3>
              <p className="mt-1 text-sm text-gray-500">
                Unggah gambar produk untuk ditampilkan kepada pelanggan.
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Unggah Gambar
                  <input
                    id="image-upload"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  JPG, PNG, atau GIF hingga 5MB
                </p>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                        <img src={url} alt={`Preview ${index + 1}`} className="object-contain" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-white shadow-sm hover:bg-gray-100"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Spesifikasi</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tambahkan spesifikasi teknis produk.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-1/3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      placeholder="Nama (mis. RAM)"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="w-1/3">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      placeholder="Nilai (mis. 8GB)"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => removeSpecField(index)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecField}
                className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                + Tambah Spesifikasi
              </button>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
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

export default ProductForm;