// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Navbar'ı ekledik

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Sayfa açılınca kitapları çek
    axios.get('http://localhost:3000/books')
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Kitaplar çekilemedi:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Üst Menü */}

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Kitap Arşivi</h1>

        {/* Eğer hiç kitap yoksa uyarı göster */}
        {books.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-xl">Henüz kütüphaneye kitap eklenmemiş.</p>
            <p className="text-sm mt-2">Yönetici hesabıyla giriş yapıp ekleyebilirsiniz.</p>
          </div>
        ) : (
          // Kitapları Listele (Grid Yapısı)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200">
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {book.description || "Açıklama yok."}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                    <span className="flex items-center gap-1">
                      👤 <span className="font-medium">{book.author?.name || 'Bilinmiyor'}</span>
                    </span>
                    <div className="flex gap-1">
                      {book.categories?.map(cat => (
                        <span key={cat.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;