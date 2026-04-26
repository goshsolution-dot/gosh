import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../aws-config';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Solution {
  id: number;
  name: string;
  description: string;
  demoAvailable: boolean;
  industry: { id: number; name: string };
}

interface Booking {
  id: number;
  type: 'demo' | 'discussion' | 'hosting';
  customer: Customer;
  solution?: Solution;
  requestedDate?: string;
  message: string;
  provider?: string;
  serviceDetails?: string;
}

interface Payment {
  id: number;
  customer: Customer;
  amount: number;
  transactionReference: string;
  service: string;
}

interface QuotationRequest {
  id: number;
  cardId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
  requirements: string;
  requestedDate: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'rejected';
}

interface RecordsData {
  solutions: Solution[];
  bookings: Booking[];
  payments: Payment[];
  customers: Customer[];
  quotations?: QuotationRequest[];
}

function AdminRecordsPage() {
  const [records, setRecords] = useState<RecordsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'payments' | 'customers' | 'solutions' | 'quotations'>('bookings');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    Promise.all([
      fetch(getApiUrl('/api/admin/records'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(getApiUrl('/api/admin/quotation-requests'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ])
      .then(async ([recordsResponse, quotationsResponse]) => {
        if (recordsResponse.status === 401 || quotationsResponse.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin');
          return;
        }
        const recordsData = await recordsResponse.json();
        const quotationsData = await quotationsResponse.json();

        if (recordsData.success) {
          setRecords({
            ...recordsData.data,
            quotations: quotationsData?.data || [],
          });
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading records...</p>
      </div>
    );
  }

  if (!records) {
    return (
      <div className="page-container">
        <p>Failed to load records.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Admin Records</h1>
        <div className="admin-actions">
          <Link to="/admin/dashboard" className="admin-link">Back to Dashboard</Link>
          <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings ({records.bookings.length})
        </button>
        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          Payments ({records.payments.length})
        </button>
        <button
          className={activeTab === 'customers' ? 'active' : ''}
          onClick={() => setActiveTab('customers')}
        >
          Customers ({records.customers.length})
        </button>
        <button
          className={activeTab === 'solutions' ? 'active' : ''}
          onClick={() => setActiveTab('solutions')}
        >
          Solutions ({records.solutions.length})
        </button>
        <button
          className={activeTab === 'quotations' ? 'active' : ''}
          onClick={() => setActiveTab('quotations')}
        >
          Quotations ({records.quotations?.length || 0})
        </button>
      </div>

      <div className="records-content">
        {activeTab === 'bookings' && (
          <div className="records-table">
            <h2>Bookings</h2>
            {records.bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Customer</th>
                    <th>Solution</th>
                    <th>Date</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {records.bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.type}</td>
                      <td>{booking.customer.name} ({booking.customer.email})</td>
                      <td>{booking.solution?.name || 'N/A'}</td>
                      <td>{booking.requestedDate || 'N/A'}</td>
                      <td>{booking.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="records-table">
            <h2>Payments</h2>
            {records.payments.length === 0 ? (
              <p>No payments found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    <th>Service</th>
                  </tr>
                </thead>
                <tbody>
                  {records.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.customer.name} ({payment.customer.email})</td>
                      <td>${payment.amount}</td>
                      <td>{payment.transactionReference}</td>
                      <td>{payment.service}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="records-table">
            <h2>Customers</h2>
            {records.customers.length === 0 ? (
              <p>No customers found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {records.customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="records-table">
            <h2>Solutions</h2>
            {records.solutions.length === 0 ? (
              <p>No solutions found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Industry</th>
                    <th>Demo Available</th>
                  </tr>
                </thead>
                <tbody>
                  {records.solutions.map((solution) => (
                    <tr key={solution.id}>
                      <td>{solution.id}</td>
                      <td>{solution.name}</td>
                      <td>{solution.description}</td>
                      <td>{solution.industry.name}</td>
                      <td>{solution.demoAvailable ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'quotations' && (
          <div className="records-table">
            <h2>Quotation Requests</h2>
            {!records.quotations || records.quotations.length === 0 ? (
              <p>No quotation requests found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Business</th>
                    <th>Phone</th>
                    <th>Requirements</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {records.quotations.map((quotation) => (
                    <tr key={quotation.id}>
                      <td>{quotation.id}</td>
                      <td>{quotation.customerName}</td>
                      <td>{quotation.customerEmail}</td>
                      <td>{quotation.businessName}</td>
                      <td>{quotation.customerPhone}</td>
                      <td>{quotation.requirements ? quotation.requirements.substring(0, 50) + '...' : 'N/A'}</td>
                      <td>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '5px',
                            backgroundColor:
                              quotation.status === 'pending'
                                ? '#FFA500'
                                : quotation.status === 'reviewed'
                                ? '#4169E1'
                                : quotation.status === 'quoted'
                                ? '#25D366'
                                : '#FF6B6B',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {quotation.status}
                        </span>
                      </td>
                      <td>{quotation.requestedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRecordsPage;