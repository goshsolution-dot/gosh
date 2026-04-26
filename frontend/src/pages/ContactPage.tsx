import { useState } from 'react';
import { getApiUrl } from '../aws-config';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('Sending...');

    try {
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('✓ Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(''), 3000);
      } else {
        setSubmitStatus('Error sending message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('Error sending message. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with our team today.</p>
      </section>

      <div className="contact-container">
        <div className="contact-main">
          <section className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Office</h3>
                <p>123 Tech Avenue<br />Silicon Valley, CA 94025<br />United States</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567<br />+1 (555) 987-6543<br />Mon - Fri, 9AM - 6PM EST</p>
              </div>
              <div className="info-card">
                <div className="info-icon">✉️</div>
                <h3>Email</h3>
                <p>support@goshsolutions.com<br />sales@goshsolutions.com<br />info@goshsolutions.com</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🌐</div>
                <h3>Social</h3>
                <p>LinkedIn | Twitter<br />Facebook | Instagram<br />Follow us for updates</p>
              </div>
            </div>
          </section>

          <section className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleFormSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
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
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="What is this about?"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
            {submitStatus && <p className={`submit-status ${submitStatus.includes('Error') ? 'error' : ''}`}>{submitStatus}</p>}
          </section>
        </div>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-items">
            <div className="faq-item">
              <h3>What are your business hours?</h3>
              <p>We operate Monday through Friday, 9 AM to 6 PM EST. For urgent matters, please call our emergency support line.</p>
            </div>
            <div className="faq-item">
              <h3>How quickly can we implement your solutions?</h3>
              <p>Implementation typically takes 2-8 weeks depending on your needs. We provide a detailed timeline during the consultation phase.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer training and support?</h3>
              <p>Yes! We provide comprehensive training, 24/7 technical support, and ongoing maintenance for all our solutions.</p>
            </div>
            <div className="faq-item">
              <h3>Can your solutions be customized?</h3>
              <p>Absolutely. Our team can tailor solutions to your specific business requirements and workflows.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;
