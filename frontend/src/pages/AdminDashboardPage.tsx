import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface OverviewData {
  solutionCount: number;
  industryCount: number;
  customerCount: number;
  bookingCount: number;
  paymentCount: number;
}

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

function AdminDashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [homepageCards, setHomepageCards] = useState<HomepageCard[]>([]);
  const [backgrounds, setBackgrounds] = useState<HomepageBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [cardForm, setCardForm] = useState({
    title: '',
    subtitle: '',
    icon: '📦',
    badgeText: '',
    demoLink: '',
    expandedText: '',
    order: 0,
    images: [] as string[],
  });
  const [backgroundForm, setBackgroundForm] = useState({
    title: '',
    imageData: '',
    order: 0,
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    async function loadDashboard() {
      try {
        const [overviewRes, homepageRes] = await Promise.all([
          fetch('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/homepage'),
        ]);

        if (overviewRes.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin');
          return;
        }

        const overviewData = await overviewRes.json();
        if (overviewData.success) {
          setOverview(overviewData.data);
        }

        const homepageData = await homepageRes.json();
        if (homepageData.success) {
          setHomepageCards(homepageData.data.cards);
          setBackgrounds(homepageData.data.backgrounds);
        }
      } catch {
        setStatusMessage('Unable to load dashboard content.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate, token]);

  const loadHomepageContent = async () => {
    try {
      const response = await fetch('/api/homepage');
      const data = await response.json();
      if (data.success) {
        setHomepageCards(data.data.cards);
        setBackgrounds(data.data.backgrounds);
      }
    } catch {
      setStatusMessage('Unable to refresh homepage content.');
    }
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleCardImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const images = await Promise.all(Array.from(files).map((file) => readFileAsDataURL(file)));
    setCardForm((prev) => {
      const newImages = [...prev.images, ...images];
      return { ...prev, images: newImages.slice(0, 4) }; // Limit to 4 images
    });
  };

  const handleCreateCard = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage('Saving new card...');

    try {
      const response = await fetch('/api/admin/homepage/cards', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: cardForm.title,
          subtitle: cardForm.subtitle,
          icon: cardForm.icon,
          badgeText: cardForm.badgeText,
          demoLink: cardForm.demoLink,
          expandedText: cardForm.expandedText,
          order: Number(cardForm.order),
          images: cardForm.images,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMessage('Homepage card added successfully.');
        setCardForm({ title: '', subtitle: '', icon: '📦', badgeText: '', demoLink: '', expandedText: '', order: 0, images: [] });
        loadHomepageContent();
      } else {
        setStatusMessage(data.message || 'Unable to create homepage card.');
      }
    } catch {
      setStatusMessage('Unable to create homepage card.');
    }
  };

  const handleCreateBackground = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage('Saving new background image...');

    try {
      const response = await fetch('/api/admin/homepage/backgrounds', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: backgroundForm.title,
          imageData: backgroundForm.imageData,
          order: Number(backgroundForm.order),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMessage('Background image added successfully.');
        setBackgroundForm({ title: '', imageData: '', order: 0 });
        loadHomepageContent();
      } else {
        setStatusMessage(data.message || 'Unable to create background image.');
      }
    } catch {
      setStatusMessage('Unable to create background image.');
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (!window.confirm('Delete this homepage card?')) return;

    try {
      const response = await fetch(`/api/admin/homepage/cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMessage('Homepage card deleted.');
        loadHomepageContent();
      } else {
        setStatusMessage(data.message || 'Could not delete card.');
      }
    } catch {
      setStatusMessage('Could not delete card.');
    }
  };

  const handleDeleteBackground = async (id: number) => {
    if (!window.confirm('Delete this background image?')) return;

    try {
      const response = await fetch(`/api/admin/homepage/backgrounds/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMessage('Background image deleted.');
        loadHomepageContent();
      } else {
        setStatusMessage(data.message || 'Could not delete background.');
      }
    } catch {
      setStatusMessage('Could not delete background.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="page-container admin-dashboard">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Homepage Management</h1>
          <p>Control homepage cards, images, and background visuals from a single admin panel.</p>
        </div>
        <div className="admin-actions">
          <Link to="/admin/records" className="admin-link">View Records</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {statusMessage && <div className="status-message">{statusMessage}</div>}

      <div className="admin-summary-grid">
        <div className="summary-card">
          <h3>Total Solutions</h3>
          <p className="summary-number">{overview?.solutionCount ?? 0}</p>
        </div>
        <div className="summary-card">
          <h3>Total Industries</h3>
          <p className="summary-number">{overview?.industryCount ?? 0}</p>
        </div>
        <div className="summary-card">
          <h3>Total Customers</h3>
          <p className="summary-number">{overview?.customerCount ?? 0}</p>
        </div>
        <div className="summary-card">
          <h3>Total Bookings</h3>
          <p className="summary-number">{overview?.bookingCount ?? 0}</p>
        </div>
        <div className="summary-card">
          <h3>Total Payments</h3>
          <p className="summary-number">{overview?.paymentCount ?? 0}</p>
        </div>
      </div>

      <div className="admin-management-grid">
        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Homepage cards</h2>
              <p>Each card defines an app or solution, and can expand into an image gallery.</p>
            </div>
            <span className="panel-badge">{homepageCards.length} cards</span>
          </div>

          {homepageCards.length === 0 ? (
            <div className="empty-state">
              <p>No homepage cards configured yet.</p>
            </div>
          ) : (
            <div className="card-list">
              {homepageCards.map((card) => (
                <article key={card.id} className="dashboard-card">
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                    <small>{card.images.length} images</small>
                  </div>
                  <button className="danger-btn" onClick={() => handleDeleteCard(card.id)}>
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}

          <form className="admin-form" onSubmit={handleCreateCard}>
            <h3>Create new card</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardTitle">Title</label>
                <input
                  id="cardTitle"
                  value={cardForm.title}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardIcon">Icon</label>
                <input
                  id="cardIcon"
                  value={cardForm.icon}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, icon: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cardSubtitle">Subtitle</label>
              <textarea
                id="cardSubtitle"
                value={cardForm.subtitle}
                onChange={(e) => setCardForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cardExpandedText">Expanded description</label>
              <textarea
                id="cardExpandedText"
                value={cardForm.expandedText}
                onChange={(e) => setCardForm((prev) => ({ ...prev, expandedText: e.target.value }))}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardBadgeText">Badge text</label>
                <input
                  id="cardBadgeText"
                  value={cardForm.badgeText}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, badgeText: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardDemoLink">Demo link</label>
                <input
                  id="cardDemoLink"
                  value={cardForm.demoLink}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, demoLink: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardOrder">Display order</label>
                <input
                  id="cardOrder"
                  type="number"
                  value={cardForm.order}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cardImages">Card images</label>
              <input id="cardImages" type="file" multiple accept="image/*" onChange={handleCardImages} />
            </div>
            {cardForm.images.length > 0 && (
              <div className="image-preview-grid">
                {cardForm.images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={image} alt={`Card preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
            <div className="form-actions">
              <button type="submit">Save card</button>
              <button type="button" className="secondary-btn" onClick={() => setCardForm({ title: '', subtitle: '', icon: '📦', badgeText: '', demoLink: '', expandedText: '', order: 0, images: [] })}>
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Background visuals</h2>
              <p>Upload images that appear as moving background assets on the homepage.</p>
            </div>
            <span className="panel-badge">{backgrounds.length} assets</span>
          </div>

          {backgrounds.length === 0 ? (
            <div className="empty-state">
              <p>No background visuals configured yet.</p>
            </div>
          ) : (
            <div className="background-grid">
              {backgrounds.map((background) => (
                <article key={background.id} className="dashboard-card dashboard-background-card">
                  <div className="background-thumb">
                    <img src={background.imageData} alt={background.title} />
                  </div>
                  <div>
                    <h3>{background.title}</h3>
                    <small>Order {background.order}</small>
                  </div>
                  <button className="danger-btn" onClick={() => handleDeleteBackground(background.id)}>
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}

          <form className="admin-form" onSubmit={handleCreateBackground}>
            <h3>Add new background image</h3>
            <div className="form-group">
              <label htmlFor="backgroundTitle">Title</label>
              <input
                id="backgroundTitle"
                value={backgroundForm.title}
                onChange={(e) => setBackgroundForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="backgroundOrder">Display order</label>
              <input
                id="backgroundOrder"
                type="number"
                value={backgroundForm.order}
                onChange={(e) => setBackgroundForm((prev) => ({ ...prev, order: Number(e.target.value) }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="backgroundFile">Image file</label>
              <input
                id="backgroundFile"
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const imageData = await readFileAsDataURL(file);
                  setBackgroundForm((prev) => ({ ...prev, imageData }));
                }}
                required
              />
            </div>
            {backgroundForm.imageData && (
              <div className="image-preview-grid">
                <div className="image-preview-item">
                  <img src={backgroundForm.imageData} alt="Background preview" />
                </div>
              </div>
            )}
            <div className="form-actions">
              <button type="submit">Save background</button>
              <button type="button" className="secondary-btn" onClick={() => setBackgroundForm({ title: '', imageData: '', order: 0 })}>
                Reset
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
