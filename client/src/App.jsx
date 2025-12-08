import { useState, useEffect } from 'react'

// Backend Portunu buraya yazmayı unutma! (Örn: 5017)
const API_URL = "http://localhost:5017/api"; 

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      fetchPrices();
    }
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error("Giriş başarısız!");

      const data = await response.text(); 
      localStorage.setItem('token', data);
      setToken(data);
      setError("");
    } catch (err) {
      setError("Giriş yapılamadı. Bilgileri kontrol et.");
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await fetch(`${API_URL}/Prices`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setPrices(data.reverse());
    } catch (err) {
      console.error("Fiyatlar çekilemedi", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPrices([]);
  };

  // --- GİRİŞ EKRANI (Login) ---
  if (!token) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-5 shadow-lg border-0" style={{ width: '400px', borderRadius: '15px' }}>
          <h2 className="text-center mb-4 fw-bold text-primary">Giriş Yap</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={login}>
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control form-control-lg" 
                     placeholder="ornek@mail.com"
                     value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Şifre</label>
              <input type="password" className="form-control form-control-lg" 
                     placeholder="******"
                     value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold">Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  // --- ANA EKRAN (Dashboard) ---
  return (
    <div className="container mt-5">
      {/* Üst Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded">
        <h2 className="m-0 fw-bold text-dark">📊 Fiyat Takip Paneli</h2>
        <div>
          <button onClick={fetchPrices} className="btn btn-outline-primary me-2 fw-bold">
             🔄 Yenile
          </button>
          <button onClick={logout} className="btn btn-danger fw-bold">
             Çıkış Yap 🚪
          </button>
        </div>
      </div>

      {/* Tablo Kartı */}
      <div className="card shadow-lg border-0" style={{borderRadius: '15px', overflow: 'hidden'}}>
        <div className="card-header bg-dark text-white p-3">
          <h5 className="m-0">📝 Son Fiyat Hareketleri</h5>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive" style={{maxHeight: '600px'}}>
            <table className="table table-striped table-hover mb-0 align-middle">
              <thead className="table-secondary sticky-top">
                <tr>
                  <th className="p-3 text-center">Oyun Adı</th>
                  <th className="p-3 text-center">Platform</th>
                  <th className="p-3 text-center">Fiyat</th>
                  <th className="p-3 text-center">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {prices.map(entry => (
                  <tr key={entry.id}>
                    {/* Oyun Adı */}
                    <td className="fw-bold text-center text-primary">
                      {entry.gameName}
                    </td>
                    
                    {/* Platform Badge */}
                    <td className="text-center">
                      <span className="badge bg-secondary rounded-pill px-3 py-2">
                        {entry.platformName}
                      </span>
                    </td>
                    
                    {/* Fiyat */}
                    <td className="text-center fw-bold text-success fs-5">
                      {entry.price} ₺
                    </td>
                    
                    {/* Tarih */}
                    <td className="text-center text-muted small">
                      {new Date(entry.recordingDate).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Veri Yoksa Gösterilecek Mesaj */}
            {prices.length === 0 && (
              <div className="text-center p-5 text-muted">
                <h4>📭 Henüz veri yok</h4>
                <p>Veritabanında kayıtlı fiyat bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
        <div className="card-footer text-muted text-end small p-2">
          Toplam Kayıt: {prices.length}
        </div>
      </div>
    </div>
  );
}

export default App