import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState<'demo' | 'quote' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('✓ Request submitted successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setActiveForm(null), 1500);
      } else {
        setSubmitStatus('Error submitting request. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('Error submitting request. Please try again.');
    }
  };

  const systems = [
    {
      name: 'Hotel System',
      description: 'Bookings, rooms, check-in/out',
      icon: '🏨',
      demoLink: '#',
    },
    {
      name: 'Pharmacy System',
      description: 'Stock management, expiry alerts',
      icon: '💊',
      demoLink: '#',
    },
    {
      name: 'Bar & Club POS',
      description: 'Fast billing, inventory tracking',
      icon: '🍺',
      demoLink: '#',
    },
    {
      name: 'Air BnB Manager',
      description: 'Channel manager, guest portal',
      icon: '🏠',
      demoLink: '#',
    },
    {
      name: 'Online Sales POS',
      description: 'M-Pesa integrated, stock control',
      icon: '🛒',
      demoLink: '#',
    },
  ];

  const clients = [
    { name: 'Capital Hotel', result: 'Cut check-in time by 70%' },
    { name: 'Lilongwe Pharmacy', result: 'Reduced stock losses by 40%' },
    { name: 'Club 2000', result: 'Increased sales by 25%' },
    { name: 'Sunset Villas', result: 'Filled 90% of bookings online' },
    { name: 'Market POS', result: 'Processed 500+ daily transactions' },
    { name: 'MediCare Pharmacy', result: 'Zero expired stock incidents' },
  ];

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">GOSH SOLUTIONS</div>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#systems">Systems</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
            <button className="quote-btn" onClick={() => setActiveForm('quote')}>Get Quote</button>
          </nav>
          <a href="https://wa.me/265xxxxxxxxx" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1>We Build Systems That Run Your Business</h1>
            <p>Hotel, Pharmacy, Bar, POS & Air BnB management software.<br />
               Built in Malawi, for Malawi. + Custom development.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' })}>
                View Our Systems
              </button>
              <button className="btn-secondary" onClick={() => setActiveForm('demo')}>
                Book Free Demo
              </button>
            </div>
            <div className="trust-bar">
              Trusted by 30+ businesses in Lilongwe & Blantyre
            </div>
          </div>
          <div className="hero-mockup">
            <div className="mockup-placeholder">
              <div className="laptop">💻</div>
              <div className="phone">📱</div>
              <p>Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Systems */}
      <section className="systems-section" id="systems">
        <div className="container">
          <h2>Ready-Made Systems You Can Deploy This Week</h2>
          <div className="systems-grid">
            {systems.map((system, index) => (
              <div key={index} className="system-card">
                <div className="system-icon">{system.icon}</div>
                <h3>{system.name}</h3>
                <p>{system.description}</p>
                {system.name.includes('POS') && <div className="mpesa-badge">M-Pesa Integrated</div>}
                <a href={system.demoLink} className="demo-btn" target="_blank" rel="noopener noreferrer">
                  Live Demo
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GOSH */}
      <section className="why-gosh-section">
        <div className="container">
          <h2>Why Businesses in Malawi Choose Us</h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>Local Support</h3>
              <p>We're in Lilongwe. Call, we answer. No timezone issues.</p>
            </div>
            <div className="why-card">
              <h3>Own Your Data</h3>
              <p>Self-hosted option. No monthly USD fees to USA companies.</p>
            </div>
            <div className="why-card">
              <h3>Built For You</h3>
              <p>We customize. Need tobacco auction reports? We add it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Development */}
      <section className="custom-dev-section">
        <div className="container">
          <h2>Need Something Unique? We Build It.</h2>
          <p>From school management to SACCO systems. Whatever your business needs.</p>
          <button className="btn-primary" onClick={() => setActiveForm('quote')}>
            Describe Your Project
          </button>
        </div>
      </section>

      {/* Portfolio */}
      <section className="portfolio-section" id="portfolio">
        <div className="container">
          <h2>Systems Powering Businesses Like Yours</h2>
          <div className="clients-grid">
            {clients.map((client, index) => (
              <div key={index} className="client-card">
                <div className="client-logo">{client.name.split(' ')[0]}</div>
                <p className="client-result">{client.result}</p>
                <p className="client-name">{client.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="process-section">
        <div className="container">
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Free Demo</h3>
              <p>See the system in action</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>We Customize</h3>
              <p>Tailor it to your needs</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Training</h3>
              <p>Get your team up to speed</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Local Support</h3>
              <p>Ongoing help when needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to stop using paper or Excel?</h2>
          <p>Let's talk about getting your business systemized.</p>
          <div className="cta-buttons">
            <a href="https://wa.me/265xxxxxxxxx" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
              WhatsApp Us: +265...
            </a>
            <button className="btn-quote" onClick={() => setActiveForm('quote')}>
              Get Quote in 24hrs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>GOSH SOLUTIONS</h3>
              <p>Systems Contact</p>
              <p>We develop websites...</p>
              <p>Hotel, Pharmacy...</p>
              <p>Lilongwe, Area 3</p>
              <p>Bar, Air BnB...</p>
              <p>+265...</p>
              <p>Custom Dev</p>
              <p>info@gosh-solutions.com</p>
            </div>
            <div className="footer-social">
              <a href="#" target="_blank" rel="noopener noreferrer">FB</a>
              <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://wa.me/265xxxxxxxxx" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 GOSH SOLUTIONS</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeForm && (
        <div className="modal-overlay" onClick={() => setActiveForm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{activeForm === 'demo' ? 'Book Free Demo' : 'Get Quote'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Optional phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={activeForm === 'demo' ? 'Tell us which system interests you...' : 'Describe your project...'}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">✓ Submit Request</button>
                <button type="button" onClick={() => setActiveForm(null)}>✕ Cancel</button>
              </div>
            </form>
            {submitStatus && <p className={`submit-status ${submitStatus.includes('Error') ? 'error' : ''}`}>{submitStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
