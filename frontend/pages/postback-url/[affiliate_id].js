import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { affiliateAPI } from '../../lib/api';

export default function PostbackUrl() {
  const router = useRouter();
  const { affiliate_id } = router.query;
  
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (affiliate_id) {
      fetchAffiliate();
    }
  }, [affiliate_id]);

  const fetchAffiliate = async () => {
    try {
      const affiliatesData = await affiliateAPI.getAffiliates();
      const currentAffiliate = affiliatesData.find(a => a.id == affiliate_id);
      setAffiliate(currentAffiliate);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const postbackUrl = `http://localhost:3001/postback?affiliate_id=${affiliate_id}&click_id={click_id}&amount={amount}&currency={currency}`;
  const productionUrl = `https://your-domain.com/postback?affiliate_id=${affiliate_id}&click_id={click_id}&amount={amount}&currency={currency}`;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (loading) {
    return (
      <Layout title="Postback URL - Loading...">
        <div className="px-4 sm:px-0">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Postback URL - ${affiliate?.name || 'Affiliate'}`}>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Postback URL Configuration
          </h1>
          <p className="text-gray-600 mt-2">
            Use this URL to send conversion postbacks for {affiliate?.name}
          </p>
        </div>

        <div className="space-y-8">
          {/* What is S2S Postback */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What is Server-to-Server (S2S) Postback?
            </h2>
            <div className="prose text-gray-600">
              <p className="mb-4">
                A Server-to-Server (S2S) postback is a method used in affiliate marketing to track conversions. 
                When a user completes a desired action (like making a purchase), the advertiser's server sends 
                a HTTP request to the affiliate network's postback URL to record the conversion.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>User clicks on affiliate link (tracked with click_id)</li>
                  <li>User completes conversion on advertiser's website</li>
                  <li>Advertiser's server sends postback to affiliate system</li>
                  <li>Conversion is recorded and attributed to the affiliate</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Development URL */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Development Postback URL
            </h2>
            <p className="text-gray-600 mb-4">
              Use this URL for testing and development:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800 break-all">
                  {postbackUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(postbackUrl)}
                  className="ml-4 btn-secondary flex-shrink-0"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Production URL */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Production Postback URL
            </h2>
            <p className="text-gray-600 mb-4">
              Replace with your production domain:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800 break-all">
                  {productionUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(productionUrl)}
                  className="ml-4 btn-secondary flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Parameters Documentation */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              URL Parameters
            </h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Description</th>
                    <th>Required</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="font-mono text-sm">affiliate_id</td>
                    <td>Your unique affiliate identifier</td>
                    <td>
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        Yes
                      </span>
                    </td>
                    <td className="font-mono text-sm">{affiliate_id}</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-sm">click_id</td>
                    <td>Unique identifier for the original click</td>
                    <td>
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        Yes
                      </span>
                    </td>
                    <td className="font-mono text-sm">abc123</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-sm">amount</td>
                    <td>Conversion value/amount</td>
                    <td>
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        Yes
                      </span>
                    </td>
                    <td className="font-mono text-sm">99.99</td>
                  </tr>
                  <tr>
                    <td className="font-mono text-sm">currency</td>
                    <td>Currency code (ISO 4217)</td>
                    <td>
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        Yes
                      </span>
                    </td>
                    <td className="font-mono text-sm">USD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Example Usage */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Example Usage
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Complete Example:</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <code className="text-sm font-mono text-gray-800 break-all">
                    {`http://localhost:3001/postback?affiliate_id=${affiliate_id}&click_id=abc123&amount=99.99&currency=USD`}
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Expected Response:</h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <pre className="text-sm text-green-800">
{`{
  "status": "success",
  "message": "Conversion tracked"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Error Response:</h3>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <pre className="text-sm text-red-800">
{`{
  "status": "error",
  "message": "Invalid click"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Notes */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Integration Notes
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Click Tracking First</p>
                  <p>Ensure clicks are tracked before sending postbacks. The click_id must exist in the system.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">HTTP Method</p>
                  <p>Use GET requests for postbacks (standard in affiliate marketing).</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Error Handling</p>
                  <p>Implement retry logic for failed postbacks and monitor response codes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
