import { useEffect, useState } from 'react';
import { awsConfig } from '../aws-config';

function AdminPage() {
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    fetch(`${awsConfig.apiEndpoint}/api/admin/overview`, {
      headers: {
        Authorization: 'Bearer ',
      },
    })
      .then((response) => response.json())
      .then((data) => setOverview(data.data))
      .catch(() => {
        setOverview(null);
      });
  }, []);

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      {overview ? (
        <div className="admin-summary">
          <div>Total solutions: {overview.solutionCount}</div>
          <div>Total industries: {overview.industryCount}</div>
          <div>Total customers: {overview.customerCount}</div>
          <div>Total bookings: {overview.bookingCount}</div>
          <div>Total payments: {overview.paymentCount}</div>
        </div>
      ) : (
        <p>Please login via API to access admin overview.</p>
      )}
    </div>
  );
}

export default AdminPage;
