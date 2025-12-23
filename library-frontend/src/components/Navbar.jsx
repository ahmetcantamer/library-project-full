// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Giriş yapan kullanıcı bilgisini al
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Ana Sayfa Linki */}
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-100">
          📚 Kütüphane
        </Link>

        {/* Sağ Taraf Linkler */}
        <div className="flex items-center gap-4">
          {!user ? (
            // Giriş YAPMAMIŞSA bunları göster
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Giriş Yap</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Kayıt Ol
              </Link>
            </>
          ) : (
            // Giriş YAPMIŞSA bunları göster
            <>
              <span className="hidden md:inline text-blue-100">Merhaba, {user.username}</span>
              
              {/* Sadece Admin ise Yönetim Paneli linkini göster */}
              {user.role === 'admin' && (
                <Link to="/dashboard" className="text-yellow-300 font-semibold hover:text-yellow-100">
                  Yönetim Paneli
                </Link>
              )}

              <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
              >
                Çıkış
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;