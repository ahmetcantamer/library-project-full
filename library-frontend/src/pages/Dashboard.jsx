// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('books'); // Varsayılan sekme: Kitaplar

  // --- VERİLER ---
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);

  // --- FORM STATE'LERİ ---
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
    authorId: '',
    categoryIds: [] // Çoklu seçim için dizi
  });

  // Token'ı al (Admin işlemi olduğu için gerekli)
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Sayfa açılınca verileri çek
  useEffect(() => {
    // Admin değilse ana sayfaya at
    if (!user || user.role !== 'admin') {
      toast.error("Bu sayfaya erişim yetkiniz yok!");
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAuth, resCat, resBook] = await Promise.all([
        axios.get('https://library-api-ynpo.onrender.com/authors'),
        axios.get('https://library-api-ynpo.onrender.com/categories'),
        axios.get('https://library-api-ynpo.onrender.com/books'),
      ]);
      setAuthors(resAuth.data);
      setCategories(resCat.data);
      setBooks(resBook.data);
    } catch (error) {
      console.error("Veri çekme hatası", error);
    }
  };

  // --- EKLEME İŞLEMLERİ ---
  const addAuthor = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://library-api-ynpo.onrender.com/authors', { name: newAuthorName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Yazar eklendi!');
      setNewAuthorName('');
      fetchData(); // Listeyi yenile
    } catch (err) { toast.error('Hata oluştu'); }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://library-api-ynpo.onrender.com/categories', { name: newCategoryName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Kategori eklendi!');
      setNewCategoryName('');
      fetchData();
    } catch (err) { toast.error('Hata oluştu'); }
  };

  const addBook = async (e) => {
    e.preventDefault();
    // Validasyon
    if (!newBook.authorId || newBook.categoryIds.length === 0) {
      toast.warning('Lütfen bir yazar ve en az bir kategori seçin!');
      return;
    }

    try {
      await axios.post('https://library-api-ynpo.onrender.com/books', {
        ...newBook,
        authorId: Number(newBook.authorId) // Sayıya çevir
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Kitap başarıyla oluşturuldu!');
      setNewBook({ title: '', description: '', authorId: '', categoryIds: [] });
      fetchData();
    } catch (err) { 
        console.log(err);
        toast.error('Kitap eklenirken hata oluştu'); 
    }
  };

  // --- SİLME İŞLEMİ (Genel) ---
  const deleteItem = async (endpoint, id) => {
    if(!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`https://library-api-ynpo.onrender.com/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info('Silindi.');
      fetchData();
    } catch (err) { toast.error('Silinemedi (İlişkili veri olabilir)'); }
  };

  // Kategori Çoklu Seçim Mantığı
  const handleCategorySelect = (catId) => {
    const currentIds = newBook.categoryIds;
    if (currentIds.includes(catId)) {
      setNewBook({ ...newBook, categoryIds: currentIds.filter(id => id !== catId) });
    } else {
      setNewBook({ ...newBook, categoryIds: [...currentIds, catId] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Yönetim Paneli</h1>

        {/* --- SEKMELER (TABS) --- */}
        <div className="flex gap-4 mb-6 border-b pb-2">
          {['books', 'authors', 'categories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'books' ? 'Kitap Yönetimi' : tab === 'authors' ? 'Yazarlar' : 'Kategoriler'}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded shadow-lg">
          
          {/* --- 1. YAZARLAR SEKMESİ --- */}
          {activeTab === 'authors' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Yazar Ekle</h2>
              <form onSubmit={addAuthor} className="flex gap-2 mb-8">
                <input 
                  className="border p-2 rounded w-full md:w-1/2" 
                  placeholder="Yazar Adı Soyadı" 
                  value={newAuthorName}
                  onChange={e => setNewAuthorName(e.target.value)}
                  required
                />
                <button className="bg-green-600 text-white px-6 rounded hover:bg-green-700">Ekle</button>
              </form>

              <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">Mevcut Yazarlar</h3>
              <ul className="space-y-2">
                {authors.map(author => (
                  <li key={author.id} className="flex justify-between bg-gray-50 p-2 rounded border">
                    <span>{author.name}</span>
                    <button onClick={() => deleteItem('authors', author.id)} className="text-red-500 hover:text-red-700">Sil</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- 2. KATEGORİLER SEKMESİ --- */}
          {activeTab === 'categories' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Kategori Ekle</h2>
              <form onSubmit={addCategory} className="flex gap-2 mb-8">
                <input 
                  className="border p-2 rounded w-full md:w-1/2" 
                  placeholder="Kategori Adı (Örn: Bilim Kurgu)" 
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  required
                />
                <button className="bg-purple-600 text-white px-6 rounded hover:bg-purple-700">Ekle</button>
              </form>

              <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">Mevcut Kategoriler</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id} className="flex justify-between bg-gray-50 p-2 rounded border">
                    <span>{cat.name}</span>
                    <button onClick={() => deleteItem('categories', cat.id)} className="text-red-500 hover:text-red-700">Sil</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* --- 3. KİTAPLAR SEKMESİ (EN ÖNEMLİSİ) --- */}
          {activeTab === 'books' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Yeni Kitap Ekle</h2>
              <form onSubmit={addBook} className="space-y-4 mb-8 border p-4 rounded bg-blue-50">
                <input 
                  className="w-full border p-2 rounded" 
                  placeholder="Kitap Başlığı" 
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})} 
                  required
                />
                <textarea 
                  className="w-full border p-2 rounded" 
                  placeholder="Kitap Açıklaması" 
                  value={newBook.description}
                  onChange={e => setNewBook({...newBook, description: e.target.value})} 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Yazar Seçimi */}
                    <div>
                        <label className="block text-sm font-bold mb-1">Yazar Seç</label>
                        <select 
                            className="w-full border p-2 rounded"
                            value={newBook.authorId}
                            onChange={e => setNewBook({...newBook, authorId: e.target.value})}
                            required
                        >
                            <option value="">Seçiniz...</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>

                    {/* Kategori Seçimi (Çoklu) */}
                    <div>
                        <label className="block text-sm font-bold mb-1">Kategoriler (Birden fazla seçilebilir)</label>
                        <div className="flex flex-wrap gap-2 border p-2 rounded bg-white h-24 overflow-y-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`text-xs px-2 py-1 rounded-full border ${
                                        newBook.categoryIds.includes(cat.id) 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-gray-100 text-gray-700 border-gray-300'
                                    }`}
                                >
                                    {cat.name} {newBook.categoryIds.includes(cat.id) && '✓'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Kitabı Kaydet</button>
              </form>

              <h3 className="font-bold text-gray-700 border-b pb-2 mb-2">Kütüphanedeki Kitaplar</h3>
              <div className="grid gap-2">
                {books.map(book => (
                  <div key={book.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <div>
                        <div className="font-bold">{book.title}</div>
                        <div className="text-sm text-gray-500">
                            Yazar: {book.author?.name || '-'} | Kat: {book.categories?.map(c=>c.name).join(', ')}
                        </div>
                    </div>
                    <button onClick={() => deleteItem('books', book.id)} className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-2 py-1 rounded">Sil</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;