function AboutPage() {
  return (
    <div className="page-container">
      <section className="about-hero">
        <h1>About GOSH Solutions</h1>
        <p>A Malawian software company building digital solutions for African businesses</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <div className="about-card">
            <h2>🎯 Who We Are</h2>
            <p>
              GOSH SOLUTIONS is a Malawian software development company based in Lilongwe. We build easy-to-use systems that suit Malawian and African businesses — helping you move from paper and WhatsApp orders to proper online operations.
            </p>
          </div>

          <div className="about-card">
            <h2>🌟 Our Mission</h2>
            <p>
              To make digital business simple for every small and emerging enterprise in Malawi and across Africa. No complicated jargon. No foreign USD subscriptions. Just systems you own, understand, and can get local support for.
            </p>
          </div>

          <div className="about-card">
            <h2>💼 Why Businesses Trust Us</h2>
            <ul className="values-list">
              <li><strong>We build for our reality</strong> — Load shedding, Airtel Money, Mpamba, and commercial bank payments, slow internet. Our systems are designed for how Malawi actually works.</li>
              <li><strong>We focus on small & emerging</strong> — You don't need complex enterprise tools. You need software that works on your phone, your staff can learn in 1 day, and grows with you.</li>
              <li><strong>Custom-made = No licensing requirement</strong> — All our products are custom-built for you. You own the system outright. No monthly license fees, no per-user charges, no surprise renewals.</li>
              <li><strong>We stay with you</strong> — Training, customization, and local support included. Because software without support is just an expense.</li>
            </ul>
          </div>
        </div>

        <div className="about-section about-compliance">
          <h2>📋 Company Status</h2>
          <div className="compliance-grid">
            <div className="compliance-card">
              <div className="compliance-icon">✓</div>
              <h3>Legally Registered</h3>
              <p>Registered with the Registrar General of Malawi</p>
            </div>
            <div className="compliance-card">
              <div className="compliance-icon">✓</div>
              <h3>Tax Compliant</h3>
              <p>Valid Tax Clearance Certificate from the Malawi Revenue Authority</p>
            </div>
            <div className="compliance-card">
              <div className="compliance-icon">✓</div>
              <h3>PPDA Registered</h3>
              <p>Registered supplier eligible to serve public institutions and development projects</p>
            </div>
          </div>
        </div>

        <div className="about-section about-services">
          <h2>🛠️ What We Build</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Ready-made Systems</h3>
              <p>For hospitality, retail, health, property, and sales — deploy in days</p>
            </div>
            <div className="service-card">
              <h3>Custom Development</h3>
              <p>We turn your business process into software, built for African markets</p>
            </div>
            <div className="service-card">
              <h3>Websites & E-commerce</h3>
              <p>Mobile-first, integrated with Airtel Money, Mpamba, and commercial banks, built to convert customers online</p>
            </div>
          </div>
        </div>

        <div className="about-section about-promise">
          <h2>🤝 Our Promise</h2>
          <p className="promise-text">
            We exist to champion the small business owner moving online for the first time. We make it easy, affordable, and local.
          </p>
        </div>

        <div className="about-section cta-section">
          <h2>Ready to Transform Your Business?</h2>
          <p>Let's build software that works for Malawi. Contact us today to discuss your needs.</p>
          <a href="/contact" className="cta-button">Get in Touch</a>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
