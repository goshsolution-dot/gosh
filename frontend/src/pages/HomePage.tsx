import { useEffect, useState } from 'react';

type HomepageCard = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  badgeText?: string;
  demoLink?: string;
  images: string[];
  expandedText?: string;
  order: number;
};

type HomepageBackground = {
  id: number;
  title: string;
  imageData: string;
  order: number;
};

type HomepageData = {
  cards: HomepageCard[];
  backgrounds: HomepageBackground[];
};

function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageData>({ cards: [], backgrounds: [] });
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHomepage() {
      try {
        const response = await fetch('/api/homepage');
        if (!response.ok) {
          setError('Unable to load homepage content.');
          return;
        }
        const data = await response.json();
        setHomepageData(data.data);
      } catch (err) {
        setError('Unable to load homepage content.');
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  const expandedCard = homepageData.cards.find((card) => card.id === expandedCardId);

  return (
    <div className="homepage-page">
      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-left">
            <h1 className="hero-headline">We Build Systems That Run Your Business</h1>
            <p className="hero-subhead">
              Hotel, Pharmacy, Bar, POS & Air BnB management software. <br />
              Built in Malawi, for Malawi. + Custom development.
            </p>
            <div className="hero-buttons">
              <a href="#systems" className="btn btn-primary btn-lg">
                View Our Systems
              </a>
              <a href="https://wa.me/265xxxxxxxxx" className="btn btn-secondary btn-lg" target="_blank" rel="noreferrer">
                Book Free Demo
              </a>
            </div>
            <div className="trust-bar-hero">
              <span>✓ Trusted by 30+ businesses in Lilongwe & Blantyre</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="mockup-container">
              <div className="mockup-laptop">💻</div>
              <div className="mockup-phone">📱</div>
              <p>Hotel Dashboard & POS System</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR SYSTEMS SECTION */}
      <section className="our-systems-section" id="systems">
        <div className="section-wrapper">
          <div className="section-header">
            <h2>Ready-Made Systems You Can Deploy This Week</h2>
            <p>Click to see live demos of each system</p>
          </div>

          {loading ? (
            <div className="empty-state loading-state">
              <p>⏳ Loading your systems...</p>
            </div>
          ) : error ? (
            <div className="empty-state error-state">
              <p>⚠️ {error}</p>
            </div>
          ) : homepageData.cards.length === 0 ? (
            <div className="empty-state no-cards-state">
              <p>📋 No cards configured yet. Add systems from the admin dashboard.</p>
            </div>
          ) : (
            <div className="systems-grid">
              {homepageData.cards.map((card, index) => (
                <article key={card.id} className="system-card" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => setExpandedCardId(card.id)}>
                  <div className="card-icon-wrapper">
                    <span className="card-icon">{card.icon}</span>
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.subtitle}</p>
                  {card.badgeText && <span className="card-mpesa-badge">{card.badgeText}</span>}
                  <div className="card-actions">
                    {card.demoLink ? (
                      <a href={card.demoLink} className="btn-demo" target="_blank" rel="noreferrer">
                        Live Demo →
                      </a>
                    ) : (
                      <span className="btn-demo disabled">Coming Soon</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {expandedCard && (
            <div className="expanded-card-modal" onClick={() => setExpandedCardId(null)}>
              <div className="expanded-card-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={() => setExpandedCardId(null)}>✕</button>
                <h3>{expandedCard.title}</h3>
                <p>{expandedCard.expandedText || expandedCard.subtitle}</p>
                {expandedCard.images.length > 0 && (
                  <div className="expanded-images">
                    {expandedCard.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`${expandedCard.title} ${idx + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WHY GOSH SECTION */}
      <section className="why-gosh-section" id="why">
        <div className="section-wrapper">
          <div className="section-header">
            <h2>Why Businesses in Malawi Choose Us</h2>
            <p>Local expertise. Affordable solutions. Real support.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🏢</div>
              <h3>Local Support</h3>
              <p>We're in Lilongwe. Call, we answer. No timezone issues. No waiting for overseas support teams.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🔒</div>
              <h3>Own Your Data</h3>
              <p>Self-hosted option. No monthly USD fees to USA companies. Your data stays in Malawi.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">⚙️</div>
              <h3>Built For You</h3>
              <p>We customize. Need tobacco auction reports? We add it. Your business, your software.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM DEVELOPMENT SECTION */}
      <section className="custom-dev-section" id="custom">
        <div className="section-wrapper">
          <h2>Need Something Unique? We Build It.</h2>
          <p>From school management to SACCO systems. If you can explain it, we can code it.</p>
          <div className="tech-badges">
            <span className="tech-badge">PHP</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">PostgreSQL</span>
            <span className="tech-badge">React</span>
          </div>
          <a href="https://wa.me/265xxxxxxxxx" className="btn btn-primary" target="_blank" rel="noreferrer">
            Describe Your Project
          </a>
        </div>
      </section>

      {/* PORTFOLIO/PROOF SECTION */}
      <section className="portfolio-section" id="portfolio">
        <div className="section-wrapper">
          <div className="section-header">
            <h2>Systems Powering Businesses Like Yours</h2>
            <p>Real results from real customers</p>
          </div>
          <div className="clients-grid">
            <div className="client-card">
              <div className="client-logo">CH</div>
              <p className="client-result">Cut hotel check-in time by 70%</p>
              <p className="client-name">Capital Hotel</p>
            </div>
            <div className="client-card">
              <div className="client-logo">PH</div>
              <p className="client-result">Stock alerts reduced waste by 40%</p>
              <p className="client-name">Premium Pharmacy</p>
            </div>
            <div className="client-card">
              <div className="client-logo">BC</div>
              <p className="client-result">POS faster by 3x at peak times</p>
              <p className="client-name">Black Cat Club</p>
            </div>
            <div className="client-card">
              <div className="client-logo">AB</div>
              <p className="client-result">Multi-property bookings in one place</p>
              <p className="client-name">AirBnB Manager</p>
            </div>
            <div className="client-card">
              <div className="client-logo">SC</div>
              <p className="client-result">M-Pesa + Cash reconciliation auto</p>
              <p className="client-name">Shop Corner</p>
            </div>
            <div className="client-card">
              <div className="client-logo">MC</div>
              <p className="client-result">Donor reporting in minutes not hours</p>
              <p className="client-name">Mission Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="process-section" id="process">
        <div className="section-wrapper">
          <div className="section-header">
            <h2>How We Work</h2>
            <p>Simple steps to transform your business</p>
          </div>
          <div className="process-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Free Demo</h3>
              <p>See exactly how the system works for your business. 30 minutes, no pressure.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>We Customize</h3>
              <p>Add your specific fields, workflows, and reports. Built for YOUR business.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Training</h3>
              <p>Your team learns the system in person or via WhatsApp. We make it simple.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Local Support</h3>
              <p>Ongoing help whenever you need it. Call, WhatsApp, or in-person support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="final-cta-section">
        <div className="cta-wrapper">
          <h2>Ready to stop using paper or Excel? Let's talk.</h2>
          <p>Get set up this week. Join 30+ local businesses running on GOSH Systems.</p>
          <div className="cta-buttons">
            <a href="https://wa.me/265xxxxxxxxx" className="btn btn-white" target="_blank" rel="noreferrer">
              📱 WhatsApp Us: +265 XX XXX XXXX
            </a>
            <a href="https://wa.me/265xxxxxxxxx" className="btn btn-outline" target="_blank" rel="noreferrer">
              Get Quote in 24hrs
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="footer-wrapper">
          <div className="footer-column">
            <h4>GOSH SOLUTIONS</h4>
            <p>Malawi business systems</p>
          </div>
          <div className="footer-column">
            <h4>Systems</h4>
            <ul>
              <li>Hotel Management</li>
              <li>Pharmacy System</li>
              <li>Bar & Club POS</li>
              <li>Air BnB Manager</li>
              <li>Online Sales POS</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <p>Lilongwe, Area 3</p>
            <p>+265 XX XXX XXXX</p>
            <p>info@gosh-solutions.com</p>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" title="Facebook">f</a>
              <a href="#" title="LinkedIn">in</a>
              <a href="#" title="WhatsApp">W</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 GOSH SOLUTIONS. All rights reserved. Built in Malawi, for Malawi.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
