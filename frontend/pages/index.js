import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { affiliateAPI } from '../lib/api';

export default function Login() {
  const [affiliates, setAffiliates] = useState([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const data = await affiliateAPI.getAffiliates();
      setAffiliates(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load affiliates. Please check if the backend is running.');
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (selectedAffiliate) {
      router.push(`/dashboard/${selectedAffiliate}`);
    }
  };

  return (
    <Layout title="Login - Affiliate Tracking">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="card max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Affiliate Login
            </h1>
            <p className="text-gray-600">
              Select your affiliate account to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="affiliate" className="block text-sm font-medium text-gray-700 mb-2">
                Choose Affiliate
              </label>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
              ) : (
                <select
                  id="affiliate"
                  value={selectedAffiliate}
                  onChange={(e) => setSelectedAffiliate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select an affiliate...</option>
                  {affiliates.map((affiliate) => (
                    <option key={affiliate.id} value={affiliate.id}>
                      {affiliate.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={!selectedAffiliate || loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Access Dashboard
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">System Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click tracking and analytics</li>
              <li>• Conversion postback handling</li>
              <li>• Real-time dashboard</li>
              <li>• Postback URL management</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
