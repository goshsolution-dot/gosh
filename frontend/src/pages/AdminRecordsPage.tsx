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
  industry?: { id: number; name: string };
}

interface Booking {
  id: number;
  type?: 'demo' | 'discussion' | 'hosting';
  bookingType?: string;
  customer?: Customer;
  solution?: Solution;
  requestedDate?: string;
  message?: string;
  provider?: string;
  serviceDetails?: string;
  solutionId?: string;
  createdAt?: string;
}

interface Payment {
  id: number;
  customer?: Customer;
  amount: number;
  transactionReference: string;
  service: string;
}

interface QuotationRequest {
  id: number;
  cardId: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  businessName?: string;
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  requirements: string;
  requestedDate: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'rejected';
  createdAt?: string;
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
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'payments' | 'customers' | 'solutions' | 'quotations'>('bookings');
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    try {
      const [recordsResponse, quotationsResponse] = await Promise.all([
        fetch(getApiUrl('/api/admin/records'), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(getApiUrl('/api/admin/quotation-requests'), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

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
      } else {
        setRecords({
          solutions: recordsData.data?.solutions || [],
          bookings: recordsData.data?.bookings || [],
          payments: recordsData.data?.payments || [],
          customers: recordsData.data?.customers || [],
          quotations: quotationsData?.data || [],
        });
      }
    } catch (error) {
      console.error('Error loading records:', error);
      localStorage.removeItem('adminToken');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const updateQuotationStatus = async (id: number, newStatus: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setUpdatingId(id);
    try {
      const response = await fetch(getApiUrl(`/api/admin/quotation-requests/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper function to parse serviceDetails JSON for bookings
  const parseServiceDetails = (serviceDetails: string | undefined) => {
    if (!serviceDetails) return null;
    try {
      return typeof serviceDetails === 'string' ? JSON.parse(serviceDetails) : serviceDetails;
    } catch {
      return null;
    }
  };

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
          Bookings ({records.bookings?.length || 0})
        </button>
        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          Payments ({records.payments?.length || 0})
        </button>
        <button
          className={activeTab === 'customers' ? 'active' : ''}
          onClick={() => setActiveTab('customers')}
        >
          Customers ({records.customers?.length || 0})
        </button>
        <button
          className={activeTab === 'solutions' ? 'active' : ''}
          onClick={() => setActiveTab('solutions')}
        >
          Solutions ({records.solutions?.length || 0})
        </button>
        <button
          className={activeTab === 'quotations' ? 'active' : ''}
          onClick={() => setActiveTab('quotations')}
        >
          Quotations ({records.quotations?.length || 0})
        </button>
      </div>

      <div className="records-content">
        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="records-table">
            <h2>Bookings</h2>
            {!records.bookings || records.bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Solution</th>
                    <th>Date</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {records.bookings.map((booking) => {
                    const details = parseServiceDetails(booking.serviceDetails);
                    const customerName = details?.customer?.name || booking.customer?.name || 'N/A';
                    const customerEmail = details?.customer?.email || booking.customer?.email || 'N/A';
                    const customerPhone = details?.customer?.phone || booking.customer?.phone || 'N/A';
                    const message = details?.message || booking.message || 'N/A';
                    const solutionName = booking.solution?.name || booking.solutionId || 'N/A';
                    const bookingType = booking.bookingType || booking.type || 'N/A';
                    
                    return (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{bookingType}</td>
                        <td>{customerName}</td>
                        <td>{customerEmail}</td>
                        <td>{customerPhone}</td>
                        <td>{solutionName}</td>
                        <td>{booking.requestedDate?.split('T')[0] || 'N/A'}</td>
                        <td>{message}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="records-table">
            <h2>Payments</h2>
            {!records.payments || records.payments.length === 0 ? (
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
                      <td>{payment.customer?.name || 'N/A'} ({payment.customer?.email || 'N/A'})</td>
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

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="records-table">
            <h2>Customers</h2>
            {!records.customers || records.customers.length === 0 ? (
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

        {/* SOLUTIONS TAB */}
        {activeTab === 'solutions' && (
          <div className="records-table">
            <h2>Solutions</h2>
            {!records.solutions || records.solutions.length === 0 ? (
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
                      <td>{solution.industry?.name || 'N/A'}</td>
                      <td>{solution.demoAvailable ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* QUOTATIONS TAB */}
        {activeTab === 'quotations' && (
          <div className="records-table">
            <h2>Quotation Requests</h2>
            {!records.quotations || records.quotations.length === 0 ? (
              <p>No quotation requests found.</p>
            ) : (
              <>
                {/* Info banner for existing data */}
                <div style={{ 
                  marginBottom: '1rem', 
                  padding: '0.75rem', 
                  background: '#E8F4FD', 
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <strong>ℹ️ Note:</strong> Future quotations will show customer details. 
                  Existing quotations may need the backend updated to store name, email, phone, and business fields.
                </div>
                
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.quotations.map((quotation) => {
                      // Get customer data from various possible field names
                      const customerName = quotation.customerName || quotation.name || 'N/A';
                      const customerEmail = quotation.customerEmail || quotation.email || 'N/A';
                      const customerPhone = quotation.customerPhone || quotation.phone || 'N/A';
                      const businessName = quotation.businessName || quotation.business || 'N/A';
                      
                      return (
                        <tr key={quotation.id}>
                          <td>{quotation.id}</td>
                          <td>{customerName}</td>
                          <td>{customerEmail}</td>
                          <td>{businessName}</td>
                          <td>{customerPhone}</td>
                          <td style={{ maxWidth: '250px', wordBreak: 'break-word' }}>
                            {quotation.requirements ? quotation.requirements.substring(0, 50) + (quotation.requirements.length > 50 ? '...' : '') : 'N/A'}
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
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
                              {quotation.status || 'pending'}
                            </span>
                          </td>
                          <td>{quotation.requestedDate?.split('T')[0] || 'N/A'}</td>
                          <td>
                            <select
                              value={quotation.status || 'pending'}
                              onChange={(e) => updateQuotationStatus(quotation.id, e.target.value)}
                              disabled={updatingId === quotation.id}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                cursor: updatingId === quotation.id ? 'wait' : 'pointer',
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="quoted">Quoted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            {updatingId === quotation.id && <span style={{ marginLeft: '0.5rem' }}>⏳</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRecordsPage;