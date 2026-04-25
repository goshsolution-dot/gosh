import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { awsConfig } from '../aws-config';

interface Solution {
  id: number;
  name: string;
  description: string;
  demoAvailable: boolean;
  demoLink?: string;
  industry: {
    id: number;
    name: string;
  };
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

function SoftwareDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'pricing' | 'liveview'>('overview');

  useEffect(() => {
    if (id) {
      fetch(`${awsConfig.apiEndpoint}/api/solutions`)
        .then(res => res.json())
        .then(data => {
          const found = data.data.find((s: Solution) => s.id === parseInt(id));
          setSolution(found);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading solution details...</div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h2>Solution not found</h2>
          <button onClick={() => navigate('/')}>Go Back to Home</button>
        </div>
      </div>
    );
  }

  const features: Feature[] = [
    { icon: '⚡', title: 'Lightning Fast', description: 'Optimized performance for demanding operations' },
    { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security and encryption' },
    { icon: '🎯', title: 'User-Friendly', description: 'Intuitive interface requires minimal training' },
    { icon: '📊', title: 'Analytics', description: 'Advanced reporting and data insights' },
    { icon: '🔄', title: 'Integration', description: 'Seamless integration with existing systems' },
    { icon: '📱', title: 'Mobile Ready', description: 'Access from anywhere on any device' },
  ];

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Solutions</button>

      <section className="software-detail-hero">
        <div className="hero-content">
          <h1>{solution.name}</h1>
          <p className="industry-badge">{solution.industry.name}</p>
          <p className="hero-description">{solution.description}</p>
          <div className="hero-actions">
            <button onClick={() => setActiveTab('liveview')} className="primary-btn">🎬 View Live Demo</button>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="secondary-btn">📞 Request Demo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="software-icon">📱</div>
        </div>
      </section>

      <section className="detail-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          ✨ Features
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          💰 Pricing
        </button>
        <button 
          className={`tab-btn ${activeTab === 'liveview' ? 'active' : ''}`}
          onClick={() => setActiveTab('liveview')}
        >
          🎬 Live View
        </button>
      </section>

      <div className="detail-content">
        {activeTab === 'overview' && (
          <section className="overview-section">
            <h2>Solution Overview</h2>
            <p className="overview-text">{solution.description}</p>
            
            <div className="overview-cards">
              <div className="overview-card">
                <h3>💼 Perfect For</h3>
                <p>{solution.industry.name} organizations of all sizes looking to streamline operations and improve efficiency.</p>
              </div>
              <div className="overview-card">
                <h3>🎯 Key Benefits</h3>
                <ul>
                  <li>Increased operational efficiency</li>
                  <li>Better data management</li>
                  <li>Improved customer service</li>
                  <li>Cost reduction</li>
                  <li>Scalable growth</li>
                </ul>
              </div>
              <div className="overview-card">
                <h3>🚀 Getting Started</h3>
                <p>Request a demo today and our team will guide you through a personalized demonstration tailored to your needs.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'features' && (
          <section className="features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-box">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'pricing' && (
          <section className="pricing-section">
            <h2>Pricing Plans</h2>
            <div className="pricing-cards">
              <div className="pricing-card">
                <h3>Starter</h3>
                <p className="price">$99<span>/month</span></p>
                <p className="description">Perfect for small businesses</p>
                <ul className="features-list">
                  <li>✓ Basic features</li>
                  <li>✓ Up to 5 users</li>
                  <li>✓ Email support</li>
                  <li>✓ 5GB storage</li>
                </ul>
                <button className="price-btn">Get Started</button>
              </div>
              <div className="pricing-card featured">
                <div className="featured-badge">Most Popular</div>
                <h3>Professional</h3>
                <p className="price">$299<span>/month</span></p>
                <p className="description">For growing organizations</p>
                <ul className="features-list">
                  <li>✓ All Starter features</li>
                  <li>✓ Up to 50 users</li>
                  <li>✓ Priority support</li>
                  <li>✓ 500GB storage</li>
                  <li>✓ Advanced analytics</li>
                </ul>
                <button className="price-btn primary">Get Started</button>
              </div>
              <div className="pricing-card">
                <h3>Enterprise</h3>
                <p className="price">Custom</p>
                <p className="description">For large organizations</p>
                <ul className="features-list">
                  <li>✓ All features</li>
                  <li>✓ Unlimited users</li>
                  <li>✓ 24/7 support</li>
                  <li>✓ Custom integration</li>
                  <li>✓ Dedicated account manager</li>
                </ul>
                <button className="price-btn">Contact Sales</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'liveview' && (
          <section className="liveview-section">
            <h2>Live Demo</h2>
            {solution.demoAvailable && solution.demoLink ? (
              <div className="demo-embed">
                <iframe
                  src={solution.demoLink}
                  title="Live Demo"
                  width="100%"
                  height="600"
                  style={{ borderRadius: '12px', border: 'none' }}
                />
              </div>
            ) : (
              <div className="demo-placeholder">
                <div className="placeholder-icon">🎬</div>
                <h3>Live Demo Coming Soon</h3>
                <p>Request a personalized demo from our sales team to see this solution in action.</p>
                <button className="demo-btn">Request Demo</button>
              </div>
            )}
          </section>
        )}
      </div>

      <section className="detail-cta">
        <h2>Ready to Transform Your Business?</h2>
        <p>Get in touch with our team today and discover how {solution.name} can help your organization.</p>
        <button onClick={() => navigate('/contact')} className="cta-btn">Contact Us Today</button>
      </section>
    </div>
  );
}

export default SoftwareDetailPage;
