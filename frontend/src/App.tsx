import { useState } from 'react';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { getS3FileUrl } from './aws-config';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRecordsPage from './pages/AdminRecordsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SoftwareDetailPage from './pages/SoftwareDetailPage';

function App() {
  const isLoggedIn = localStorage.getItem('adminToken') !== null;
  const navigate = useNavigate();
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  const handleNavClick = () => {
    setServiceDropdownOpen(false);
  };

  return (
    <div>
      <header className="app-header">
        <div className="header-logo">
          <Link to="/" onClick={handleNavClick} className="header-logo-link">
            <img src={getS3FileUrl('log.jpg')} alt="GOSH Solutions logo" />
            <span className="company-name">GOSH SOLUTIONS</span>
          </Link>
        </div>

        <nav className="header-nav">
          <div className="nav-group nav-group-left">
            <Link to="/" onClick={handleNavClick}>Home</Link>
            <a href="/#systems" onClick={handleNavClick}>Systems</a>
            <Link to="/about" onClick={handleNavClick}>About</Link>
            <Link to="/contact" onClick={handleNavClick}>Contact</Link>
          </div>

          <div className="nav-group nav-group-right">
            <a
              className="whatsapp-header-btn"
              href="https://wa.me/265xxxxxxxxx"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <Link to="/admin" onClick={handleNavClick} className="admin-nav-link">Admin</Link>
            <button
              className="nav-menu-toggle"
              onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
              type="button"
              aria-label="Open mobile menu"
            >
              ☰
            </button>
          </div>
        </nav>

        {serviceDropdownOpen && (
          <div className="mobile-nav-menu">
            <Link to="/" onClick={() => { handleNavClick(); setServiceDropdownOpen(false); }}>Home</Link>
            <a href="/#systems" onClick={() => { handleNavClick(); setServiceDropdownOpen(false); }}>Systems</a>
            <Link to="/about" onClick={() => { handleNavClick(); setServiceDropdownOpen(false); }}>About Us</Link>
            <Link to="/contact" onClick={() => { handleNavClick(); setServiceDropdownOpen(false); }}>Contact</Link>
            <a
              href="https://wa.me/265xxxxxxxxx"
              target="_blank"
              rel="noreferrer"
              onClick={() => setServiceDropdownOpen(false)}
            >
              WhatsApp
            </a>
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/software/:id" element={<SoftwareDetailPage />} />
          <Route path="/admin" element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <AdminLoginPage />} />
          <Route path="/admin/dashboard" element={isLoggedIn ? <AdminDashboardPage /> : <Navigate to="/admin" />} />
          <Route path="/admin/records" element={isLoggedIn ? <AdminRecordsPage /> : <Navigate to="/admin" />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2026 GOSH Solutions. All rights reserved. | <Link to="/contact">Contact Us</Link> | <Link to="/about">About Us</Link></p>
        </div>
      </footer>
    </div>
  );
}

export default App;
