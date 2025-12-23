// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basit bir şifre kontrolü (Backend de kontrol ediyor ama frontend'de de uyaralım)
    if (formData.password.length < 6) {
        toast.warning('Şifre en az 6 karakter olmalıdır!');
        return;
    }

    try {
      // 1. Backend'e Kayıt İsteği At
      await axios.post('https://library-api-ynpo.onrender.com/auth/register', formData);

      // 2. Başarılıysa Login'e Yönlendir
      toast.success('Kayıt başarılı! Şimdi giriş yapabilirsin.');
      navigate('/login');
      
    } catch (error) {
      // Backend'den gelen hatayı göster (Örn: "Bu email zaten kayıtlı")
      const errorMsg = error.response?.data?.message;
      toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || 'Kayıt başarısız!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Kayıt Ol</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Kullanıcı Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
            <input 
              type="text" 
              name="username"
              className="mt-1 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* E-Posta */}
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input 
              type="email" 
              name="email"
              className="mt-1 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Şifre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input 
              type="password" 
              name="password"
              className="mt-1 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
              placeholder="En az 6 karakter"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Hesap Oluştur
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Zaten hesabın var mı? <Link to="/login" className="text-green-600 hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;