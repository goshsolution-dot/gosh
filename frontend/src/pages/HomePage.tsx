import { FormEvent, useEffect, useState } from 'react';
import { awsConfig } from '../aws-config';

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
  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const url = `${awsConfig.apiEndpoint}${path}`;
    console.log("Calling API:", url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  };

  const [homepageData, setHomepageData] = useState<HomepageData>({ cards: [], backgrounds: [] });
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isDemoFormOpen, setIsDemoFormOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [demoSource, setDemoSource] = useState<'hero' | 'card' | null>(null);
  const [formType, setFormType] = useState<'demo' | 'project' | 'quotation'>('demo');

  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: '',
    solutionId: null as number | null,
  });

  const [quotationForm, setQuotationForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    selectedCard: null as number | null,
    requirements: '',
  });

  const [error, setError] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [industries, setIndustries] = useState<string[]>([]);

  // ✅ LOAD HOMEPAGE
  useEffect(() => {
    async function loadHomepage() {
      try {
        const response = await apiFetch('/api/homepage');
        
        // Extract data from API response wrapper
        const data = response.data || response;
        
        if (!data || !data.cards) {
          console.warn('Invalid homepage data received:', response);
          setHomepageData({ cards: [], backgrounds: [] });
          setIndustries([]);
          return;
        }

        setHomepageData(data);

        const uniqueIndustries = [
          ...new Set(
            data.cards.map((card: HomepageCard) => card.industry || 'General')
          ),
        ];

        setIndustries(uniqueIndustries);
      } catch (err) {
        console.error('Error loading homepage:', err);
        setError('Unable to load homepage content. Please refresh the page.');
        setHomepageData({ cards: [], backgrounds: [] });
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  // ✅ CAROUSEL
  useEffect(() => {
    if (homepageData.cards.length === 0) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % homepageData.cards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [homepageData.cards.length]);

  const expandedCard = homepageData.cards.find((c) => c.id === expandedCardId);

  // ✅ DEMO SUBMIT
  const handleDemoFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

      await apiFetch('/api/demo-requests', {
        method: 'POST',
        body: JSON.stringify(demoData),
      });

      const message = `Hello GOSH Solutions, I would like a demo.
Name: ${demoForm.name}
Phone: ${demoForm.phone}`;

      setWhatsappLink(`https://wa.me/265xxxxxxxxx?text=${encodeURIComponent(message)}`);
      setDemoSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit demo request.');
    }
  };

  // ✅ WHATSAPP SUBMIT
  const handleWhatsAppSubmit = async () => {
    try {
      await apiFetch('/api/demo-requests', {
        method: 'POST',
        body: JSON.stringify({
          solutionId: demoForm.solutionId || 1,
          requestedDate: new Date().toISOString().split('T')[0],
          customer: {
            name: demoForm.name,
            email: demoForm.email,
            phone: demoForm.phone,
          },
          message: demoForm.message,
        }),
      });
    } catch (err) {
      console.error(err);
    }

    window.open(
      `https://wa.me/265xxxxxxxxx?text=${encodeURIComponent("Demo request")}`,
      '_blank'
    );
  };

  // ✅ QUOTATION SUBMIT
  const handleQuotationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await apiFetch('/api/quotation-requests', {
        method: 'POST',
        body: JSON.stringify({
          cardId: quotationForm.selectedCard,
          customer: {
            name: quotationForm.name,
            email: quotationForm.email,
            phone: quotationForm.phone,
          },
          business: quotationForm.business,
          requirements: quotationForm.requirements,
          requestedDate: new Date().toISOString().split('T')[0],
        }),
      });

      alert('✓ Quotation submitted!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit quotation.');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="hero" 
        style={{
          background: homepageData.backgrounds[0]?.imageData || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <h1>GOSH Solutions</h1>
        <p>Digital business systems built for Africa</p>
      </section>

      {/* Cards Section */}
      <section className="cards-section">
        <h2>Our Solutions</h2>
        
        {loading && <p>Loading solutions...</p>}
        {error && <p className="error">{error}</p>}
        
        {!loading && homepageData.cards.length > 0 ? (
          <div className="cards-grid">
            {homepageData.cards.map((card) => (
              <div 
                key={card.id} 
                className={`card ${expandedCardId === card.id ? 'expanded' : ''}`}
                onClick={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
              >
                <div className="card-header">
                  <span className="card-icon">{card.icon}</span>
                  {card.badgeText && <span className="card-badge">{card.badgeText}</span>}
                </div>
                <h3>{card.title}</h3>
                <p className="card-subtitle">{card.subtitle}</p>
                
                {expandedCardId === card.id && (
                  <div className="card-expanded">
                    <p>{card.expandedText}</p>
                    <div className="card-actions">
                      <button onClick={() => setFormType('demo')} className="demo-btn">
                        📅 Request Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No solutions available</p>
        )}
      </section>

      {/* Demo Form Modal */}
      {isDemoFormOpen && (
        <div className="modal-overlay" onClick={() => setIsDemoFormOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Request Demo</h2>
            <form onSubmit={handleDemoSubmit}>
              <input 
                type="text" 
                placeholder="Name" 
                value={demoForm.name}
                onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={demoForm.email}
                onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                required 
              />
              <input 
                type="tel" 
                placeholder="Phone" 
                value={demoForm.phone}
                onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Message" 
                value={demoForm.message}
                onChange={(e) => setDemoForm({...demoForm, message: e.target.value})}
              />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setIsDemoFormOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;