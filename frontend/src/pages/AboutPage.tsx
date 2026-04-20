function AboutPage() {
  return (
    <div className="page-container">
      <section className="about-hero">
        <h1>About GOSH Solutions</h1>
        <p>Transforming businesses through innovative software solutions since 2020</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <div className="about-card">
            <h2>🎯 Our Mission</h2>
            <p>
              To empower organizations across industries—Education, Retail, and Healthcare—with cutting-edge software solutions 
              that drive efficiency, innovation, and sustainable growth. We believe technology should be accessible, intuitive, 
              and transformative.
            </p>
          </div>

          <div className="about-card">
            <h2>🌟 Our Vision</h2>
            <p>
              To be the globally recognized leader in providing industry-specific software solutions that enable businesses to 
              thrive in the digital age. We envision a world where organizations of all sizes can leverage enterprise-grade 
              technology.
            </p>
          </div>

          <div className="about-card">
            <h2>💼 Our Values</h2>
            <ul className="values-list">
              <li><strong>Innovation:</strong> Constantly pushing boundaries with emerging technologies</li>
              <li><strong>Excellence:</strong> Delivering superior quality in every solution</li>
              <li><strong>Integrity:</strong> Building trust through transparent practices</li>
              <li><strong>Customer Success:</strong> Your growth is our success</li>
              <li><strong>Collaboration:</strong> Working together to achieve extraordinary results</li>
            </ul>
          </div>
        </div>

        <div className="about-section about-industries">
          <h2>Industries We Serve</h2>
          <div className="industries-grid">
            <div className="industry-card">
              <div className="industry-emoji">🎓</div>
              <h3>Education</h3>
              <p>Comprehensive learning management systems and student administration platforms</p>
            </div>
            <div className="industry-card">
              <div className="industry-emoji">🏪</div>
              <h3>Retail</h3>
              <p>Point of sale, inventory management, and customer engagement solutions</p>
            </div>
            <div className="industry-card">
              <div className="industry-emoji">⚕️</div>
              <h3>Healthcare</h3>
              <p>Patient management, EHR systems, and hospital administration tools</p>
            </div>
          </div>
        </div>

        <div className="about-section about-team">
          <h2>Why Choose GOSH Solutions?</h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <div className="reason-icon">⚡</div>
              <h3>Fast Implementation</h3>
              <p>Quick deployment with minimal disruption to your operations</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🎨</div>
              <h3>User-Friendly Design</h3>
              <p>Intuitive interfaces that require minimal training</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🛡️</div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade security and data protection standards</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🌍</div>
              <h3>Global Support</h3>
              <p>24/7 support team ready to help you succeed</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">📈</div>
              <h3>Scalable Solutions</h3>
              <p>Grow with us—our solutions scale with your business</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🔄</div>
              <h3>Continuous Innovation</h3>
              <p>Regular updates and new features based on market trends</p>
            </div>
          </div>
        </div>

        <div className="about-section cta-section">
          <h2>Ready to Transform Your Business?</h2>
          <p>Join hundreds of organizations that have already increased their efficiency with GOSH Solutions.</p>
          <a href="/contact" className="cta-button">Get Started Today</a>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
