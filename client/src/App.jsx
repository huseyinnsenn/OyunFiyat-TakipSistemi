import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Alert, Badge, Modal, Row, Col } from 'react-bootstrap'; 
import { FaPlus, FaRedo, FaSignOutAlt, FaChartLine, FaEnvelope, FaLock, FaGamepad, FaCalendar, FaGlobe, FaDollarSign, FaBoxes, FaTag, FaRulerHorizontal } from 'react-icons/fa'; 

// Backend Portunu buraya yazmayı unutma! (Örn: 5017)
const API_URL = "http://localhost:5017/api"; 

// --- ANA UYGULAMA BİLEŞENİ ---
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

  // Mock Metrikler (Sadece Görsel için)
  const totalGames = 4;
  const avgPrice = 1250;
  const maxPrice = 1999;

  useEffect(() => {
    if (token) {
      fetchPrices();
    }
  }, [token]);

  // --- Login, Fetch, Logout, AddGame Fonksiyonları (DEĞİŞMEDİ) ---
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
        if (response.status === 403) {
             setFormMessage({ text: 'Yetkiniz yok. Admin rolü gereklidir.', type: 'danger' });
        } else {
             setFormMessage({ text: 'Oyun eklenirken bir hata oluştu.', type: 'danger' });
        }
        return;
      }
      
      setFormMessage({ text: `${newGameTitle} başarıyla eklendi!`, type: 'success' });
      setTimeout(() => {
        setShowModal(false);
        setNewGameTitle('');
        setNewGamePublisher('');
        setNewGameReleaseDate('');
        setFormMessage({ text: '', type: '' });
      }, 1500);
    } catch (err) {
      setFormMessage({ text: 'Bağlantı hatası oluştu.', type: 'danger' });
    }
  };
  // -------------------------------------------------------------------

  // --- EKRAN 1: GİRİŞ EKRANI (Login) ---
  if (!token) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Card className="p-5 shadow-lg border-light" style={{ width: '400px', borderRadius: '15px' }}>
          <h2 className="text-center mb-4 fw-bold text-primary"><FaChartLine className="me-2" /> Giriş Yap</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={login}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-light"><FaEnvelope className="me-1" /> Email</Form.Label>
              <Form.Control type="email" size="lg" placeholder="ornek@mail.com"
                            value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-light"><FaLock className="me-1" /> Şifre</Form.Label>
              <Form.Control type="password" size="lg" placeholder="******"
                            value={password} onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold">Giriş Yap</Button>
          </Form>
        </Card>
      </Container>
    );
  }

// ... (Kodun Başı Değişmedi) ...

// --- EKRAN 2: ANA EKRAN (Dashboard) ---
  return (
    // 👈 1. Dış katman: Padding'i kaldırıyoruz (p-5 yok).
    <div className="bg-dark p-5 min-vh-100">      
      {/* 👈 2. İç katman: Centering'i zorluyoruz: mx-auto ile ortala, max-width ile genişliği sınırla. */}
      <Container style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Üst Bar */}
        <div className="d-flex justify-content-between align-items-center mb-5 p-3 bg-dark border border-secondary rounded">          <h2 className="m-0 fw-bold text-light"><FaChartLine className="me-2 text-info" /> Fiyat Takip Paneli</h2>
          <div>
            <Button onClick={() => setShowModal(true)} variant="info" className="me-2 fw-bold">
              <FaPlus className="me-1" /> Yeni Oyun Ekle
            </Button>
            <Button onClick={fetchPrices} variant="outline-light" className="me-2 fw-bold">
              <FaRedo className="me-1" /> Yenile
            </Button>
            <Button onClick={logout} variant="danger" className="fw-bold">
              <FaSignOutAlt className="me-1" /> Çıkış Yap
            </Button>
          </div>
        </div>
        
        {/* Metrik Kartları */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card bg="primary" text="white" className="shadow-lg h-100">
              <Card.Body>
                <h5 className="card-title"><FaBoxes className="me-2" /> Toplam Oyun</h5>
                <Card.Text className="fs-1 fw-bold">{totalGames}</Card.Text>
                <Badge bg="light" text="dark">Veritabanı Kaydı</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="success" text="white" className="shadow-lg h-100">
              <Card.Body>
                <h5 className="card-title"><FaRulerHorizontal className="me-2" /> Ortalama Fiyat</h5>
                <Card.Text className="fs-1 fw-bold">{avgPrice} ₺</Card.Text>
                <Badge bg="light" text="dark">Tüm Zamanlar</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card bg="warning" text="dark" className="shadow-lg h-100">
              <Card.Body>
                <h5 className="card-title"><FaTag className="me-2" /> En Yüksek Fiyat</h5>
                <Card.Text className="fs-1 fw-bold">{maxPrice} ₺</Card.Text>
                <Badge bg="dark" text="light">Son 24 Saat</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tablo Kartı */}
        <Card bg="dark" className="shadow-lg border-secondary" style={{borderRadius: '15px', overflow: 'hidden'}}>
          <Card.Header className="bg-secondary text-white p-3">
            <h5 className="m-0">📝 Canlı Fiyat Akışı</h5>
          </Card.Header>
          
          <Card.Body className="p-0">
            <div className="table-responsive" style={{maxHeight: '600px'}}>
              <Table striped bordered hover variant="dark" responsive className="mb-0 align-middle">
                <thead className="table-secondary sticky-top">
                  <tr>
                    <th className="p-3 text-center"><FaGamepad /> Oyun Adı</th>
                    <th className="p-3 text-center"><FaGlobe /> Platform</th>
                    <th className="p-3 text-center"><FaDollarSign /> Fiyat</th>
                    <th className="p-3 text-center"><FaCalendar /> Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map(entry => (
                    <tr key={entry.id}>
                      <td className="fw-bold text-center text-info">{entry.gameName}</td>
                      <td className="text-center">
                        <Badge bg="primary" className="px-3 py-2">
                          {entry.platformName}
                        </Badge>
                      </td>
                      <td className="text-center fw-bold text-warning fs-5">
                        {entry.price} ₺
                      </td>
                      <td className="text-center text-muted small">
                        {new Date(entry.recordingDate).toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {prices.length === 0 && (
                <div className="text-center p-5 text-muted">
                  <h4>📭 Henüz veri yok</h4>
                  <p>Veritabanında kayıtlı fiyat bulunamadı.</p>
                </div>
              )}
            </div>
          </Card.Body>
          <Card.Footer className="text-muted text-end small p-2">
            Görünen Kayıt: {prices.length}
          </Card.Footer>
        </Card>

        {/* MODAL (YENİ OYUN EKLE) */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered data-bs-theme="light">
          <Modal.Header closeButton>
            <Modal.Title><FaPlus className="me-1" /> Yeni Oyun Ekle</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAddGame}>
            <Modal.Body>
              {formMessage.text && <Alert variant={formMessage.type}>{formMessage.text}</Alert>}
              
              <Form.Group className="mb-3">
                <Form.Label><FaGamepad className="me-1" /> Oyun Başlığı</Form.Label>
                <Form.Control type="text" required value={newGameTitle} onChange={(e) => setNewGameTitle(e.target.value)} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label><FaDollarSign className="me-1" /> Yayıncı</Form.Label>
                <Form.Control type="text" required value={newGamePublisher} onChange={(e) => setNewGamePublisher(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><FaCalendar className="me-1" /> Çıkış Tarihi</Form.Label>
                <Form.Control type="date" required value={newGameReleaseDate} onChange={(e) => setNewGameReleaseDate(e.target.value)} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Kapat
              </Button>
              <Button variant="success" type="submit">
                Kaydet
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </Container>
    
    </div>
  );
}

export default App