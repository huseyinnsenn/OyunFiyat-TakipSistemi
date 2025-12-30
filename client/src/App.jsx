import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Alert, Badge, Modal, Row, Col } from 'react-bootstrap'; 
import { FaPlus, FaRedo, FaChartLine, FaEnvelope, FaLock, FaGamepad, FaCalendar, FaGlobe, FaDollarSign, FaBoxes, FaTag, FaRulerHorizontal } from 'react-icons/fa'; 
import CustomNavbar from './components/Navbar';

// Backend Portunu buraya yazmayı unutma!
const API_URL = "http://localhost:5017/api"; 

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prices, setPrices] = useState([]);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGamePublisher, setNewGamePublisher] = useState("");
  const [newGameReleaseDate, setNewGameReleaseDate] = useState("");
  const [formMessage, setFormMessage] = useState({ text: '', type: '' });

  // Mock Metrikler
  const totalGames = prices.length > 0 ? [...new Set(prices.map(p => p.gameName))].length : 0;
  const avgPrice = prices.length > 0 ? (prices.reduce((acc, curr) => acc + curr.price, 0) / prices.length).toFixed(2) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices.map(p => p.price)) : 0;

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

  const handleAddGame = async (e) => {
    e.preventDefault();
    setFormMessage({ text: 'Kaydediliyor...', type: 'info' });
    const gameData = {
      title: newGameTitle,
      publisher: newGamePublisher,
      releaseDate: newGameReleaseDate
    };
    try {
      const response = await fetch(`${API_URL}/Games`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(gameData)
      });

      if (!response.ok) {
        setFormMessage({ text: 'Hata oluştu veya yetkiniz yok.', type: 'danger' });
        return;
      }
      
      setFormMessage({ text: `${newGameTitle} başarıyla eklendi!`, type: 'success' });
      setTimeout(() => {
        setShowModal(false);
        setNewGameTitle('');
        setNewGamePublisher('');
        setNewGameReleaseDate('');
        setFormMessage({ text: '', type: '' });
        fetchPrices();
      }, 1500);
    } catch (err) {
      setFormMessage({ text: 'Bağlantı hatası.', type: 'danger' });
    }
  };

  // --- EKRAN 1: GİRİŞ EKRANI ---
  if (!token) {
    return (
      <div className="login-wrapper d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Card className="p-5 shadow-lg border-secondary bg-dark text-light" style={{ width: '400px', borderRadius: '15px' }}>
          <h2 className="text-center mb-4 fw-bold text-info"><FaChartLine className="me-2" /> Giriş Yap</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={login}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold"><FaEnvelope className="me-1" /> Email</Form.Label>
              <Form.Control type="email" size="lg" placeholder="ornek@mail.com" className="bg-secondary text-white border-0"
                            value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold"><FaLock className="me-1" /> Şifre</Form.Label>
              <Form.Control type="password" size="lg" placeholder="******" className="bg-secondary text-white border-0"
                            value={password} onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="info" size="lg" className="w-100 fw-bold">Giriş Yap</Button>
          </Form>
        </Card>
      </div>
    );
  }

  // --- EKRAN 2: ANA EKRAN (DASHBOARD) ---
  return (
    <div className="app-wrapper">
      <CustomNavbar userEmail={email} onLogout={logout} />
      
      <main className="main-container">
        {/* Üst Başlık ve Aksiyonlar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0 fw-bold text-info"><FaChartLine className="me-2" /> Takip Paneli</h2>
          <div>
            <Button onClick={() => setShowModal(true)} variant="info" className="me-2 fw-bold shadow-sm">
              <FaPlus className="me-1" /> Yeni Oyun Ekle
            </Button>
            <Button onClick={fetchPrices} variant="outline-light" className="fw-bold shadow-sm">
              <FaRedo className="me-1" /> Yenile
            </Button>
          </div>
        </div>
        
        {/* Metrik Kartları */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="game-card shadow-lg h-100 bg-primary text-white border-0">
              <Card.Body>
                <h5 className="card-title opacity-75"><FaBoxes className="me-2" /> Toplam Oyun</h5>
                <Card.Text className="display-5 fw-bold">{totalGames}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="game-card shadow-lg h-100 bg-success text-white border-0">
              <Card.Body>
                <h5 className="card-title opacity-75"><FaRulerHorizontal className="me-2" /> Ortalama Fiyat</h5>
                <Card.Text className="display-5 fw-bold">{avgPrice} ₺</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="game-card shadow-lg h-100 bg-warning text-dark border-0">
              <Card.Body>
                <h5 className="card-title opacity-75"><FaTag className="me-2" /> En Yüksek</h5>
                <Card.Text className="display-5 fw-bold">{maxPrice} ₺</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Canlı Akış Tablosu */}
        <Card className="game-card shadow-lg border-0 overflow-hidden bg-dark">
          <Card.Header className="bg-secondary bg-opacity-25 text-white p-3 border-0">
            <h5 className="m-0 fw-bold text-info">📝 Canlı Fiyat Akışı</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive" style={{maxHeight: '500px'}}>
              <Table hover variant="dark" className="mb-0 align-middle">
                <thead className="table-dark">
                  <tr>
                    <th className="p-3">Oyun Adı</th>
                    <th className="p-3 text-center">Platform</th>
                    <th className="p-3 text-center">Fiyat</th>
                    <th className="p-3 text-center">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map(entry => (
                    <tr key={entry.id} className="border-secondary border-opacity-10">
                      <td className="p-3 fw-bold text-info">{entry.gameName}</td>
                      <td className="text-center">
                        <Badge bg="primary" className="rounded-pill px-3 py-2">{entry.platformName}</Badge>
                      </td>
                      <td className="text-center fw-bold text-warning fs-5">{entry.price} ₺</td>
                      <td className="text-center text-muted small">
                        {new Date(entry.recordingDate).toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {prices.length === 0 && (
                <div className="text-center p-5 text-muted">Henüz veri yok...</div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Modal: Yeni Oyun Ekle */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <div className="bg-dark text-light border border-secondary rounded shadow">
            <Modal.Header closeButton closeVariant="white" className="border-secondary">
              <Modal.Title><FaPlus className="me-2" /> Yeni Oyun Ekle</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleAddGame}>
              <Modal.Body>
                {formMessage.text && <Alert variant={formMessage.type}>{formMessage.text}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Oyun Başlığı</Form.Label>
                  <Form.Control className="bg-secondary text-white border-0" type="text" required value={newGameTitle} onChange={(e) => setNewGameTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Yayıncı</Form.Label>
                  <Form.Control className="bg-secondary text-white border-0" type="text" required value={newGamePublisher} onChange={(e) => setNewGamePublisher(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Çıkış Tarihi</Form.Label>
                  <Form.Control className="bg-secondary text-white border-0" type="date" required value={newGameReleaseDate} onChange={(e) => setNewGameReleaseDate(e.target.value)} />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer className="border-secondary">
                <Button variant="outline-light" onClick={() => setShowModal(false)}>İptal</Button>
                <Button variant="info" type="submit" className="fw-bold">Kaydet</Button>
              </Modal.Footer>
            </Form>
          </div>
        </Modal>

      </main>
    </div>
  );
}

export default App;