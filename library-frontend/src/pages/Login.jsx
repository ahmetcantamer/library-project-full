// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Backend'e İstek At
      const response = await axios.post('https://library-api-ynpo.onrender.com/auth/login', {
        username,
        password
      });

      // 2. Gelen Token'ı ve Kullanıcı Bilgisini Kaydet
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // 3. Başarılı Mesajı ve Yönlendirme
      toast.success(`Hoş geldin, ${response.data.user.username}!`);
      navigate('/'); // Ana sayfaya git
      
    } catch (error) {
      toast.error('Giriş başarısız! Kullanıcı adı veya şifre yanlış.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Giriş Yap</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
            <input 
              type="text" 
              className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input 
              type="password" 
              className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Giriş Yap
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Hesabın yok mu? <Link to="/register" className="text-blue-600 hover:underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;