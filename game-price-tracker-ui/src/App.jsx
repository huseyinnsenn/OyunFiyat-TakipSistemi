import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from './api';

// --- FORUM BİLEŞENİ ---
const ForumView = ({ onBack }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);

  useEffect(() => {
    api.get('/forum/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Kategori çekme hatası:", err));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setLoadingThreads(true);
      api.get(`/Forum/categories/${selectedCategory.id}/posts`)
        .then(res => {
          setThreads(res.data);
          setLoadingThreads(false);
        })
        .catch(err => {
          console.error("Konu çekme hatası:", err);
          setLoadingThreads(false);
        });
    }
  }, [selectedCategory]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack} 
        className="mb-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline transition-all"
      >
        ← Oyun Listesine Dön
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h2 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-wider">Kategoriler</h2>
          {categories.length > 0 ? (
            categories.map(cat => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  selectedCategory?.id === cat.id 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.02]' 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="font-bold">{cat.name}</div>
                <div className={`text-xs mt-1 ${selectedCategory?.id === cat.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {cat.description}
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-400 text-sm italic">Kategoriler yükleniyor...</div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-wider">
            {selectedCategory ? `${selectedCategory.name} Tartışmaları` : "Bir Kategori Seçin"}
          </h2>
          
          <div className="space-y-4">
            {loadingThreads ? (
              <div className="p-10 text-center text-slate-400 animate-pulse">Konular yükleniyor...</div>
            ) : threads.length > 0 ? (
              threads.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {t.title}
                    </h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase">Konu</span>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] text-indigo-600 font-bold">
                        {t.userName?.charAt(0) || "A"}
                      </div>
                      <span className="text-xs text-slate-500">Açan: <b>{t.userName || "Anonim"}</b></span>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                      Oku →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-[2rem] p-12 text-center text-slate-400 border-2 border-dashed border-slate-100">
                {selectedCategory 
                  ? "Bu kategori henüz çok sessiz... İlk konuyu sen açmak ister misin?" 
                  : "Tartışmalara katılmak için sol taraftan bir ilgi alanı seçin."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ANA UYGULAMA BİLEŞENİ ---
function App() {
  const [view, setView] = useState('home'); 
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loadingReviews, setLoadingReviews] = useState(false);

  // --- AUTH VE MODAL STATE'LERİ ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authData, setAuthData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [user, setUser] = useState(null);

  // --- 🆕 OYUN EKLEME VE UPDATE STATE'LERİ ---
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Yeni mi Düzenleme mi?
  const [newGame, setNewGame] = useState({ title: '', price: '', imageUrl: '', publisher: '', platformId: 1 });

  // --- 🆕 YORUM STATE'LERİ ---
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null); // Hangi yorum düzenleniyor?

  // --- 🆕 PLATFORM EKLEME STATE'LERİ ---
  const [showAddPlatformModal, setShowAddPlatformModal] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [platforms, setPlatforms] = useState([
    { id: null, name: "Tümü", color: "bg-slate-400" },
    { id: 1, name: "PlayStation", color: "bg-blue-600" },
    { id: 2, name: "Nintendo", color: "bg-red-600" },
    { id: 3, name: "Xbox", color: "bg-green-600" }
  ]);

  // --- 🆕 ARAMA STATE'İ ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- 🆕 SAYFALAMA STATE'LERİ ---
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 6;

  // Token kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    if (token && email) {
      setUser({ email, role });
    }
  }, []);

  // Platformları Çek
  useEffect(() => {
    api.get('/platforms')
      .then(res => {
        const dynamicPlatforms = res.data.map(p => ({
          ...p,
          color: p.id === 1 ? "bg-blue-600" : p.id === 2 ? "bg-red-600" : p.id === 3 ? "bg-green-600" : "bg-indigo-600"
        }));
        setPlatforms([{ id: null, name: "Tümü", color: "bg-slate-400" }, ...dynamicPlatforms]);
      })
      .catch(() => console.log("Statik platformlar kullanılıyor."));
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        const res = await api.post('/auth/login', { email: authData.email, password: authData.password });
        localStorage.setItem('token', res.data);
        localStorage.setItem('userEmail', authData.email);
        
        const isAdmin = authData.email === 'fhs@huseyinsen@hotmail.com' || authData.email === 'deneme123@gmail.com';
        const role = isAdmin ? 'Admin' : 'User';
        localStorage.setItem('userRole', role);
        
        setUser({ email: authData.email, role });
        setShowAuthModal(false);
        alert("Giriş yapıldı!");
      } else {
        await api.post('/auth/register', authData);
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        setAuthMode('login');
      }
    } catch (err) {
      alert("Hata: " + (err.response?.data || "İşlem başarısız"));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setView('home');
  };

  const deleteGame = async (gameId) => {
    if (!window.confirm("Bu oyunu silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/games/${gameId}`);
      setGames(games.filter(g => g.id !== gameId));
    } catch (err) {
      alert("Hata: Silme yetkiniz olmayabilir.");
    }
  };

  // --- ORTAK KAYDETME (ADD/UPDATE) FONKSİYONU ---
  const handleSaveGame = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...newGame, 
        price: parseFloat(newGame.price),
        platformId: parseInt(newGame.platformId) 
      };

      if (isEditing) {
        // GÜNCELLEME İŞLEMİ
        await api.put(`/games/${newGame.id}`, payload);
        alert("Oyun başarıyla güncellendi!");
      } else {
        // YENİ EKLEME İŞLEMİ
        await api.post('/games', payload);
        alert("Oyun başarıyla eklendi!");
      }

      setShowAddGameModal(false);
      setIsEditing(false);
      setNewGame({ title: '', price: '', imageUrl: '', publisher: '', platformId: 1 });
      // Listeyi yenile
      const res = await api.get('/games');
      setGames(res.data);
    } catch (err) {
      alert("İşlem hatası: Admin yetkiniz olmayabilir veya sunucu hatası.");
    }
  };

  // --- DÜZENLEME MODUNU AÇAN FONKSİYON ---
  const openEditModal = (game) => {
    setNewGame({
      id: game.id,
      title: game.title,
      price: game.price,
      imageUrl: game.imageUrl || '',
      publisher: game.publisher || '',
      platformId: game.platformId || 1
    });
    setIsEditing(true);
    setShowAddGameModal(true);
  };

  // --- YORUM EKLEME VEYA GÜNCELLEME FONKSİYONU ---
  const handleAddOrUpdateReview = async () => {
    if (!comment.trim()) return alert("Lütfen bir yorum yazın.");
    try {
      if (editingReviewId) {
        // GÜNCELLEME (PUT)
        await api.put(`/Review/${editingReviewId}`, {
          content: comment,
          rating: rating
        });
        setEditingReviewId(null);
        alert("Yorum güncellendi!");
      } else {
        // YENİ EKLEME (POST)
        await api.post('/Review', {
          gameId: selectedGame.id,
          content: comment,
          rating: rating
        });
        alert("Yorumunuz başarıyla eklendi!");
      }
      
      setComment('');
      setRating(5);
      
      // Verileri Tazele
      const resReviews = await api.get(`/Review/game/${selectedGame.id}`);
      setReviews(resReviews.data);
      const resStats = await api.get(`/Review/game/${selectedGame.id}/stats`);
      setStats(resStats.data);
    } catch (err) {
      alert("Hata oluştu: " + (err.response?.data || "İşlem başarısız"));
    }
  };

  // --- YORUM SİLME FONKSİYONU ---
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Yorumu silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/Review/${reviewId}`);
      alert("Yorum silindi.");
      // Listeyi yenile
      const resReviews = await api.get(`/Review/game/${selectedGame.id}`);
      setReviews(resReviews.data);
      const resStats = await api.get(`/Review/game/${selectedGame.id}/stats`);
      setStats(resStats.data);
    } catch (err) {
      alert("Hata: Yorum silinemedi.");
    }
  };

  // --- YORUM DÜZENLEME MODUNA GEÇİŞ ---
  const startEditingReview = (rev) => {
    setEditingReviewId(rev.id);
    setComment(rev.content);
    setRating(rev.rating);
    // Modalın en üstüne (yorum formuna) odaklanması için
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddPlatform = async (e) => {
    e.preventDefault();
    if (!newPlatformName.trim()) return;
    try {
      await api.post('/platforms', { name: newPlatformName });
      alert("Yeni platform eklendi!");
      setNewPlatformName('');
      setShowAddPlatformModal(false);
      // Listeyi yenile
      const res = await api.get('/platforms');
      const dynamicPlatforms = res.data.map(p => ({ ...p, color: "bg-indigo-600" }));
      setPlatforms([{ id: null, name: "Tümü", color: "bg-slate-400" }, ...dynamicPlatforms]);
    } catch (err) {
      alert("Platform eklenemedi.");
    }
  };

  useEffect(() => {
    if (view === 'home') {
      setLoading(true);
      const url = selectedPlatform ? `/games?platformId=${selectedPlatform}` : '/games';
      api.get(url)
        .then(res => { 
          setGames(res.data); 
          setLoading(false);
          setCurrentPage(1); // Filtre değişince ilk sayfaya dön
        })
        .catch(() => setLoading(false));
    }
  }, [selectedPlatform, view]);

  useEffect(() => {
    if (selectedGame) {
      setPriceHistory([]);
      setReviews([]);
      setLoadingReviews(true);
      setEditingReviewId(null); 
      api.get(`/prices/game/${selectedGame.id}`).then(res => setPriceHistory(res.data));
      api.get(`/Review/game/${selectedGame.id}`).then(res => { setReviews(res.data); setLoadingReviews(false); });
      api.get(`/Review/game/${selectedGame.id}/stats`).then(res => setStats(res.data));
    }
  }, [selectedGame]);

  // --- 🆕 ARAMA VE SAYFALAMA HESAPLAMALARI ---
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.publisher?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              GamePrice<span className="text-indigo-600">Tracker</span>
            </h1>
            <p className="text-slate-500 text-sm">Gerçek zamanlı fiyat takibi ve analiz</p>
          </div>
          <div className="flex items-center gap-3">
             {/* ADMIN BUTONLARI */}
             {user?.role === 'Admin' && view === 'home' && (
               <>
                 <button 
                  onClick={() => setShowAddPlatformModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
                 >
                   + Platform Ekle
                 </button>
                 <button 
                  onClick={() => { setIsEditing(false); setNewGame({ title: '', price: '', imageUrl: '', publisher: '', platformId: 1 }); setShowAddGameModal(true); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95"
                 >
                   + Oyun Ekle
                 </button>
               </>
             )}

             <button 
                onClick={() => setView(view === 'home' ? 'forum' : 'home')}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                  view === 'home' ? 'bg-slate-800 hover:bg-black text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
             >
                {view === 'home' ? "Topluluk Forumu 💬" : "Oyun Takibine Dön 🎮"}
             </button>
             
             {user ? (
               <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl pl-4 border border-slate-100">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{user.role}</span>
                   <span className="text-xs font-bold text-slate-700">{user.email}</span>
                 </div>
                 <button onClick={handleLogout} className="bg-white text-red-500 px-4 py-2 rounded-xl text-xs font-black border border-red-50 border-b-2 active:translate-y-px">Çıkış</button>
               </div>
             ) : (
               <button 
                 onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100"
               >
                 Giriş Yap
               </button>
             )}
          </div>
        </header>

        {view === 'home' ? (
          <>
            {/* ARAMA ÇUBUĞU */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative group">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors">🔍</span>
                <input 
                  type="text" 
                  placeholder="Oyun adı veya yayıncı ara..."
                  className="w-full pl-11 pr-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {platforms.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${
                    selectedPlatform === p.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md scale-105' 
                    : 'border-transparent bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2.5 ${p.color}`}></span>
                  {p.name}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-80 bg-white rounded-3xl animate-pulse border border-slate-100" />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* 🆕 BURADA games YERİNE currentGames (sayfalanmış liste) KULLANIYORUZ */}
                  {currentGames.length > 0 ? currentGames.map(game => (
                    <div key={game.id} className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                      
                      {user?.role === 'Admin' && (
                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteGame(game.id); }}
                            className="bg-white/90 text-red-600 p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all active:scale-90"
                          >
                            🗑️
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(game); }}
                            className="bg-white/90 text-amber-600 p-2 rounded-full shadow-lg hover:bg-amber-600 hover:text-white transition-all active:scale-90"
                          >
                            ✏️
                          </button>
                        </div>
                      )}

                      <div className="h-56 bg-slate-200 relative overflow-hidden">
                        <img 
                          src={game.imageUrl || "https://placehold.co/600x400"} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={game.title} 
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{game.title}</h3>
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Güncel Fiyat</span>
                              <span className="text-xl font-black text-emerald-600">{game.price > 0 ? `${game.price} TL` : "Fiyat Yok"}</span>
                          </div>
                          <button 
                            onClick={() => setSelectedGame(game)} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition-all active:scale-95"
                          >
                            İncele
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center text-slate-400 italic bg-white rounded-3xl border border-slate-100">
                      Aramanızla eşleşen oyun bulunamadı...
                    </div>
                  )}
                </div>

                {/* 🆕 SAYFALAMA BUTONLARI */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 disabled:opacity-50 transition-all"
                    >
                      ← Önceki
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 disabled:opacity-50 transition-all"
                    >
                      Sonraki →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <ForumView onBack={() => setView('home')} />
        )}

        {/* MODAL BÖLÜMLERİ AYNEN KORUNDU */}
        {showAddPlatformModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[120] animate-in zoom-in duration-300">
            <div className="bg-white rounded-[2.5rem] max-w-sm w-full p-10 shadow-2xl relative">
              <button onClick={() => setShowAddPlatformModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600">✕</button>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Platform Tanımla</h2>
              <form onSubmit={handleAddPlatform} className="space-y-4">
                <input type="text" placeholder="Platform Adı" className="w-full p-4 bg-slate-50 rounded-2xl border outline-indigo-500" value={newPlatformName} required onChange={e => setNewPlatformName(e.target.value)} />
                <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">Sisteme Kaydet</button>
              </form>
            </div>
          </div>
        )}

        {showAddGameModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in zoom-in duration-300">
            <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl relative">
              <button onClick={() => {setShowAddGameModal(false); setIsEditing(false);}} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600">✕</button>
              <h2 className="text-2xl font-black text-slate-800 mb-6">{isEditing ? "Oyunu Düzenle" : "Yeni Oyun Ekle"}</h2>
              <form onSubmit={handleSaveGame} className="space-y-4">
                <input type="text" placeholder="Oyun Adı" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" value={newGame.title} required onChange={e => setNewGame({...newGame, title: e.target.value})} />
                <input type="number" placeholder="Fiyat" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" value={newGame.price} required onChange={e => setNewGame({...newGame, price: e.target.value})} />
                <input type="text" placeholder="Görsel URL" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" value={newGame.imageUrl} onChange={e => setNewGame({...newGame, imageUrl: e.target.value})} />
                <input type="text" placeholder="Yayıncı" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" value={newGame.publisher} onChange={e => setNewGame({...newGame, publisher: e.target.value})} />
                <select className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" value={newGame.platformId} onChange={e => setNewGame({...newGame, platformId: parseInt(e.target.value)})}>
                  {platforms.filter(p => p.id !== null).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button type="submit" className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 ${isEditing ? 'bg-amber-600 shadow-amber-100 hover:bg-amber-700' : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'}`}>
                  {isEditing ? "Değişiklikleri Kaydet" : "Sisteme Kaydet"}
                </button>
              </form>
            </div>
          </div>
        )}

        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl relative">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600">✕</button>
              <h2 className="text-3xl font-black text-slate-800 mb-2">{authMode === 'login' ? 'Hoş Geldin' : 'Kayıt Ol'}</h2>
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div className="flex gap-3">
                    <input type="text" placeholder="Ad" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" required onChange={e => setAuthData({...authData, firstName: e.target.value})} />
                    <input type="text" placeholder="Soyad" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" required onChange={e => setAuthData({...authData, lastName: e.target.value})} />
                  </div>
                )}
                <input type="email" placeholder="E-posta" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" required onChange={e => setAuthData({...authData, email: e.target.value})} />
                <input type="password" placeholder="Şifre" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-indigo-500" required onChange={e => setAuthData({...authData, password: e.target.value})} />
                <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 active:scale-95 transition-all">
                  {authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              </form>
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                {authMode === 'login' ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
              </button>
            </div>
          </div>
        )}

        {selectedGame && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 my-auto">
              <button onClick={() => setSelectedGame(null)} className="absolute top-6 right-6 text-slate-400">✕</button>

              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">Oyun Detayı</span>
                    <h2 className="text-3xl font-black text-slate-800 mt-3 leading-tight">{selectedGame.title}</h2>
                  </div>
                  {stats.totalReviews > 0 && (
                    <div className="bg-amber-50 px-3 py-2 rounded-2xl text-center border border-amber-100">
                      <div className="text-amber-600 font-black text-lg">⭐ {stats.averageRating}</div>
                      <div className="text-[9px] text-amber-400 font-bold uppercase">{stats.totalReviews} Yorum</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Güncel Fiyat</p>
                    <p className="text-2xl font-black text-emerald-600">{selectedGame.price > 0 ? `${selectedGame.price} TL` : "---"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Yayıncı</p>
                    <p className="font-bold text-slate-700 truncate">{selectedGame.publisher || "Bilinmiyor"}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Fiyat Analizi</h4>
                  {priceHistory.length > 0 ? (
                    <div className="h-40 w-full bg-slate-50 rounded-2xl p-2 border border-slate-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="recordingDate" hide />
                          <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                          <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString('tr-TR')} />
                          <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : <div className="text-center text-xs text-slate-400 italic">Veri yok.</div>}
                </div>

                <div id="review-form" className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                    {editingReviewId ? "Yorumunu Düzenle" : "Senin Değerlendirmen"}
                  </h4>
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setRating(star)} className={`text-2xl transition-all ${rating >= star ? 'text-amber-500 scale-110' : 'text-slate-200 hover:text-amber-200'}`}>⭐</button>
                        ))}
                      </div>
                      <textarea 
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm outline-indigo-500" 
                        placeholder="Bu oyun hakkında ne düşünüyorsun?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button onClick={handleAddOrUpdateReview} className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                          {editingReviewId ? "Güncelle" : "Yorumu Gönder"}
                        </button>
                        {editingReviewId && (
                          <button onClick={() => { setEditingReviewId(null); setComment(''); setRating(5); }} className="bg-slate-200 text-slate-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">İptal</button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-indigo-50 rounded-2xl text-center">
                      <p className="text-xs text-indigo-600 font-bold">Yorum yapmak için giriş yapmalısın.</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Kullanıcı Yorumları</h4>
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {loadingReviews ? (
                      <div className="text-center py-4 text-slate-400 animate-pulse text-sm">Yükleniyor...</div>
                    ) : reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                          
                          {(user?.email === rev.userEmail || user?.role === 'Admin') && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditingReview(rev)} className="text-slate-400 hover:text-amber-500 transition-colors">✏️</button>
                              <button onClick={() => handleDeleteReview(rev.id)} className="text-slate-400 hover:text-red-500 transition-colors">🗑️</button>
                            </div>
                          )}

                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-indigo-600">{rev.userEmail}</span>
                            <span className="text-amber-500 text-xs">{"⭐".repeat(rev.rating)}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{rev.content}</p>
                        </div>
                      ))
                    ) : <div className="text-center py-6 text-slate-400 text-xs italic">Henüz yorum yok.</div>}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedGame(null)} 
                  className="w-full py-4 bg-slate-800 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;