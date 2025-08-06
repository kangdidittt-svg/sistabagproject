import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">E-Katalog</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Platform e-katalog terpercaya untuk menemukan produk berkualitas dengan harga terbaik. 
              Temukan berbagai kategori produk yang Anda butuhkan.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@e-katalog.com</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+62 123 456 7890</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu Utama</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link 
                  to="/catalog" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <Link 
                  to="/promos" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Promo Terbaru
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategori Populer</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300 text-sm">Elektronik</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Fashion</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Rumah Tangga</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Olahraga</span>
              </li>
              <li>
                <span className="text-gray-300 text-sm">Kesehatan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} E-Katalog. Semua hak dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/admin/login" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Admin Panel
              </Link>
              <span className="text-gray-400 text-sm">
                Kebijakan Privasi
              </span>
              <span className="text-gray-400 text-sm">
                Syarat &amp; Ketentuan
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}