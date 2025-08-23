import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { affiliateAPI } from '../../lib/api';

export default function Dashboard() {
  const router = useRouter();
  const { affiliate_id } = router.query;
  
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (affiliate_id) {
      fetchDashboardData();
    }
  }, [affiliate_id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [affiliatesData, clicksData, conversionsData] = await Promise.all([
        affiliateAPI.getAffiliates(),
        affiliateAPI.getAffiliateClicks(affiliate_id),
        affiliateAPI.getAffiliateConversions(affiliate_id)
      ]);

      const currentAffiliate = affiliatesData.find(a => a.id == affiliate_id);
      setAffiliate(currentAffiliate);
      setClicks(clicksData);
      setConversions(conversionsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout title="Dashboard - Loading...">
        <div className="px-4 sm:px-0">
          <LoadingSpinner size="lg" text="Loading dashboard data..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard - Error">
        <div className="px-4 sm:px-0">
          <ErrorMessage error={error} onRetry={fetchDashboardData} />
        </div>
      </Layout>
    );
  }

  const totalClicks = clicks.length;
  const totalConversions = conversions.length;
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0;
  const totalRevenue = conversions.reduce((sum, conv) => sum + parseFloat(conv.amount), 0);

  return (
    <Layout title={`Dashboard - ${affiliate?.name || 'Affiliate'}`}>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {affiliate?.name} Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your clicks, conversions, and performance metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-semibold text-gray-900">{totalClicks}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-semibold text-gray-900">{totalConversions}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{conversionRate}%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalRevenue, 'USD')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clicks Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Clicks</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Click ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clicks.length > 0 ? (
                  clicks.slice(0, 10).map((click) => (
                    <tr key={click.id}>
                      <td className="font-medium">{click.campaign_name}</td>
                      <td className="font-mono text-sm">{click.click_id}</td>
                      <td>{formatDate(click.timestamp)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-8">
                      No clicks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversions Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Conversions</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Click ID</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conversions.length > 0 ? (
                  conversions.slice(0, 10).map((conversion) => (
                    <tr key={conversion.id}>
                      <td className="font-medium">{conversion.campaign_name}</td>
                      <td className="font-mono text-sm">{conversion.original_click_id}</td>
                      <td className="font-semibold text-green-600">
                        {formatCurrency(conversion.amount, conversion.currency)}
                      </td>
                      <td>{conversion.currency}</td>
                      <td>{formatDate(conversion.timestamp)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-8">
                      No conversions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
