import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <div className="text-6xl font-bold text-gray-300 -mt-4">Oops!</div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </button>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Atau coba kunjungi:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/catalog" className="text-blue-600 hover:text-blue-800">
              Katalog Produk
            </Link>
            <Link to="/categories" className="text-blue-600 hover:text-blue-800">
              Kategori
            </Link>
            <Link to="/promos" className="text-blue-600 hover:text-blue-800">
              Promo Terbaru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}