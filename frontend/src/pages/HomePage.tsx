import { FormEvent, useEffect, useState } from 'react';

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
  industry?: string;
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
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isDemoFormOpen, setIsDemoFormOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [demoSource, setDemoSource] = useState<'hero' | 'card' | null>(null);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: '',
    solutionId: null as number | null,
  });
  const [error, setError] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [industries, setIndustries] = useState<string[]>([]);

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
        
        // Extract unique industries from cards
        const uniqueIndustries = [...new Set(data.data.cards.map((card: HomepageCard) => card.industry || 'General'))];
        setIndustries(uniqueIndustries);
      } catch (err) {
        setError('Unable to load homepage content.');
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  // Carousel rotation effect
  useEffect(() => {
    if (homepageData.cards.length === 0) return;
    
    const carouselInterval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % homepageData.cards.length);
    }, 5000); // Rotate every 5 seconds
    
    return () => clearInterval(carouselInterval);
  }, [homepageData.cards.length]);

  const expandedCard = homepageData.cards.find((card) => card.id === expandedCardId);

  const handleOpenDemoForm = (source: 'hero' | 'card' = 'hero', cardId?: number) => {
    setDemoSource(source);
    if (cardId) {
      setDemoForm(prev => ({ ...prev, solutionId: cardId }));
    }
    setIsDemoFormOpen(true);
    setDemoSubmitted(false);
  };

  const handleCloseDemoForm = () => {
    setIsDemoFormOpen(false);
    setDemoSubmitted(false);
    setDemoForm({ name: '', email: '', phone: '', business: '', message: '' });
    setWhatsappLink('');
    setDemoSource(null);
  };

  const handleDemoFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      // Submit to backend
      const demoData = {
        solutionId: demoForm.solutionId || 1, // Default to first solution if not specified
        requestedDate: new Date().toISOString().split('T')[0], // Today's date
        customer: {
          name: demoForm.name,
          email: demoForm.email,
          phone: demoForm.phone,
        },
        message: demoForm.message,
      };

      const response = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit demo request');
      }

      // Create WhatsApp message
      const cardInfo = demoSource === 'card' && expandedCard ? `\nCard: ${expandedCard.title}` : '';
      const message = `Hello GOSH Solutions, I would like to book a free demo.${cardInfo}\nName: ${demoForm.name}\nEmail: ${demoForm.email}\nPhone: ${demoForm.phone}\nBusiness: ${demoForm.business}\nDetails: ${demoForm.message}`;
      setWhatsappLink(`https://wa.me/265xxxxxxxxx?text=${encodeURIComponent(message)}`);
      setDemoSubmitted(true);
    } catch (error) {
      console.error('Error submitting demo request:', error);
      alert('Failed to submit demo request. Please try again.');
    }
  };

  const handleWhatsAppSubmit = async () => {
    // Submit to backend first
    try {
      const demoData = {
        solutionId: demoForm.solutionId || 1,
        requestedDate: new Date().toISOString().split('T')[0],
        customer: {
          name: demoForm.name,
          email: demoForm.email,
          phone: demoForm.phone,
        },
        message: demoForm.message,
      };

      await fetch('/api/demo-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoData),
      });
    } catch (error) {
      console.error('Error submitting demo request:', error);
    }

    // Open WhatsApp
    const cardInfo = demoSource === 'card' && expandedCard ? `\nCard: ${expandedCard.title}` : '';
    const message = `Hello GOSH Solutions, I would like to book a free demo.${cardInfo}\nName: ${demoForm.name}\nEmail: ${demoForm.email}\nPhone: ${demoForm.phone}\nBusiness: ${demoForm.business}\nDetails: ${demoForm.message}`;
    const whatsappUrl = `https://wa.me/265xxxxxxxxx?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNextImage = () => {
    if (expandedCard && expandedCard.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % expandedCard.images.length);
    }
  };

  const handlePrevImage = () => {
    if (expandedCard && expandedCard.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + expandedCard.images.length) % expandedCard.images.length);
    }
  };

  return (
    <div className="homepage-page">
      {/* CENTERED BRAND TITLE */}
      <header className="centered-brand-header">
        <h1 className="centered-brand-title">GOSH SOLUTIONS</h1>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-backgrounds">
          {homepageData.backgrounds.map((background, index) => {
            const imageStyle = background.imageData.trim().startsWith('linear-gradient')
              ? background.imageData
              : `url(${background.imageData})`;

            return (
              <div
                key={background.id}
                className={`hero-bg hero-bg-${index % 5}`}
                style={{ backgroundImage: imageStyle }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <div className="hero-container">
          <div className="hero-left">
            <p className="hero-brand">GOSH SOLUTIONS</p>
            <h1 className="hero-headline">We Build Systems That Run Your Business</h1>
            <p className="hero-subhead">
              Hotel, Pharmacy, Bar, POS & Air BnB management software. <br />
              Built in Malawi, for Malawi. + Custom development.
            </p>
            <div className="hero-buttons">
              <a href="#systems" className="btn btn-primary btn-lg">
                View Our Systems
              </a>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => handleOpenDemoForm('hero')}>
                Book Free Demo
              </button>
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

      {isDemoFormOpen && (
        <div className="demo-form-modal" role="dialog" aria-modal="true">
          <div className="demo-form-content">
            <button type="button" className="demo-form-close" onClick={handleCloseDemoForm}>
              ✕
            </button>
            <div className="demo-form-header">
              <h2>Book Your Free Demo</h2>
              <p>Please complete this short form before continuing to WhatsApp.</p>
            </div>
            <form className="demo-form" onSubmit={handleDemoFormSubmit}>
              <div className="demo-form-row">
                <label>
                  Name
                  <input
                    value={demoForm.name}
                    onChange={(e) => setDemoForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={demoForm.email}
                    onChange={(e) => setDemoForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </label>
              </div>
              <div className="demo-form-row">
                <label>
                  Phone
                  <input
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </label>
                <label>
                  Business
                  <input
                    value={demoForm.business}
                    onChange={(e) => setDemoForm((prev) => ({ ...prev, business: e.target.value }))}
                    required
                  />
                </label>
              </div>
              <label>
                What would you like included in the demo?
                <textarea
                  value={demoForm.message}
                  onChange={(e) => setDemoForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={4}
                />
              </label>
              <div className="demo-form-actions">
                <button type="submit" className="btn btn-primary btn-lg">
                  📝 Submit to Database
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={handleWhatsAppSubmit}>
                  💬 WhatsApp & Submit
                </button>
              </div>
            </form>
            {demoSubmitted && (
              <div className="demo-whatsapp-actions">
                <p>Great! Your demo details are ready to send.</p>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">
                  Open WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OUR SYSTEMS SECTION */}
      <section className="our-systems-section" id="systems">
        <div className="section-wrapper">
          <div className="section-header">
            <h2>Ready-Made Systems You Can Deploy This Week</h2>
            <p>Click to see live demos of each system</p>
          </div>

          {/* INDUSTRY FILTERS */}
          <div className="industry-filters">
            <button
              className={`filter-btn ${selectedIndustry === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedIndustry('all')}
            >
              All Industries
            </button>
            {industries.map((industry) => (
              <button
                key={industry}
                className={`filter-btn ${selectedIndustry === industry ? 'active' : ''}`}
                onClick={() => setSelectedIndustry(industry)}
              >
                {industry}
              </button>
            ))}
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
            <div className="systems-layout">
              {/* CARDS GRID - LEFT SIDE */}
              <div className="systems-grid-container">
                <div className="systems-grid">
                  {homepageData.cards
                    .filter(card => selectedIndustry === 'all' || (card.industry || 'General') === selectedIndustry)
                    .map((card, index) => {
                    const isRotating = index === carouselIndex;
                    return (
                      <article
                        key={card.id}
                        className={`system-card ${isRotating ? 'rotating' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => {
                          setExpandedCardId(card.id);
                          setCurrentImageIndex(0);
                        }}
                      >
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
                    );
                  })}
                </div>
              </div>

              {/* ALTERNATING CARDS PREVIEW - RIGHT SIDE */}
              <div className="dashboard-preview-container">
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <h3>✨ Featured Systems</h3>
                    <p>Rotating showcase of our solutions</p>
                  </div>
                  <div className="alternating-cards-container">
                    {homepageData.cards
                      .filter(card => selectedIndustry === 'all' || (card.industry || 'General') === selectedIndustry)
                      .map((card, index) => {
                        const isActive = index === carouselIndex % homepageData.cards.length;
                        return (
                          <div
                            key={`preview-${card.id}`}
                            className={`alternating-card ${isActive ? 'active' : ''}`}
                            style={{
                              transform: `translateX(${(index - carouselIndex) * 100}%)`,
                              transition: 'transform 0.5s ease-in-out'
                            }}
                          >
                            <div className="preview-card-content">
                              <div className="preview-card-icon">
                                <span>{card.icon}</span>
                              </div>
                              <h4 className="preview-card-title">{card.title}</h4>
                              <p className="preview-card-description">{card.subtitle}</p>
                              {card.badgeText && (
                                <span className="preview-card-badge">{card.badgeText}</span>
                              )}
                              <div className="preview-card-features">
                                <div className="feature-item">✓ Real-time updates</div>
                                <div className="feature-item">✓ Mobile responsive</div>
                                <div className="feature-item">✓ Local support</div>
                              </div>
                              <div className="preview-card-actions">
                                <button
                                  className="btn-preview-demo"
                                  onClick={() => {
                                    setExpandedCardId(card.id);
                                    setCurrentImageIndex(0);
                                  }}
                                >
                                  View Details →
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="preview-indicators">
                    {homepageData.cards
                      .filter(card => selectedIndustry === 'all' || (card.industry || 'General') === selectedIndustry)
                      .map((card, index) => (
                        <button
                          key={`indicator-${card.id}`}
                          className={`indicator ${index === carouselIndex % homepageData.cards.length ? 'active' : ''}`}
                          onClick={() => setCarouselIndex(index)}
                          aria-label={`View ${card.title}`}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {expandedCard && (
            <div className="expanded-card-modal" onClick={() => setExpandedCardId(null)}>
              <div className="expanded-card-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={() => setExpandedCardId(null)}>✕</button>
                
                {/* Content Sections */}
                <div className="expanded-card-body">
                  <h2 className="expanded-card-title">{expandedCard.title}</h2>
                  
                  {expandedCard.badgeText && (
                    <span className="expanded-card-badge">{expandedCard.badgeText}</span>
                  )}

                  <div className="expanded-card-section">
                    <h3>Overview</h3>
                    <p>{expandedCard.expandedText || expandedCard.subtitle}</p>
                  </div>

                  <div className="expanded-card-section">
                    <h3>Key Features</h3>
                    <ul className="features-list">
                      <li>✓ Easy to use interface</li>
                      <li>✓ Real-time reporting</li>
                      <li>✓ Mobile-friendly design</li>
                      <li>✓ Multi-user support</li>
                      <li>✓ Data backup & security</li>
                      <li>✓ Local support in Malawi</li>
                    </ul>
                  </div>

                  <div className="expanded-card-section">
                    <h3>Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Setup Time:</span>
                        <span className="info-value">1-3 days</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Support:</span>
                        <span className="info-value">24/7 Local</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Training:</span>
                        <span className="info-value">Included</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Updates:</span>
                        <span className="info-value">Free forever</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="expanded-card-actions">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => {
                        handleOpenDemoForm('card', expandedCard.id);
                        setExpandedCardId(null);
                      }}
                    >
                      📅 Book Demo
                    </button>
                    <button
                      className="btn btn-secondary btn-lg"
                      onClick={() => {
                        handleOpenDemoForm('card', expandedCard.id);
                        setExpandedCardId(null);
                      }}
                    >
                      ℹ️ More Information
                    </button>
                    {expandedCard.demoLink && (
                      <a href={expandedCard.demoLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg">
                        🔗 Live Demo
                      </a>
                    )}
                  </div>

                  {/* IMAGE GALLERY AT BOTTOM */}
                  {expandedCard.images.length > 0 && (
                    <div className="expanded-image-gallery">
                      <div className="gallery-main">
                        <img src={expandedCard.images[currentImageIndex]} alt={`${expandedCard.title} ${currentImageIndex + 1}`} />
                      </div>
                      {expandedCard.images.length > 1 && (
                        <div className="gallery-controls">
                          <button className="gallery-arrow" onClick={handlePrevImage}>❮</button>
                          <div className="gallery-indicators">
                            {expandedCard.images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(idx)}
                              />
                            ))}
                          </div>
                          <button className="gallery-arrow" onClick={handleNextImage}>❯</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
