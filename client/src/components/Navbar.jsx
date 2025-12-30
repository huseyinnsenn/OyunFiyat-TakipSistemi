import { Navbar, Container, Button } from 'react-bootstrap';

const CustomNavbar = ({ userEmail, onLogout }) => (
  <Navbar bg="transparent" variant="dark" expand="lg" className="border-bottom border-secondary mb-4">
    <Container>
      <Navbar.Brand href="/" className="fw-bold text-info">🎮 GamePrice Tracker</Navbar.Brand>
      <div className="d-flex align-items-center">
        <span className="text-secondary me-3 d-none d-sm-block small">{userEmail}</span>
        <Button variant="outline-light" size="sm" onClick={onLogout}>Çıkış Yap</Button>
      </div>
    </Container>
  </Navbar>
);

export default CustomNavbar;