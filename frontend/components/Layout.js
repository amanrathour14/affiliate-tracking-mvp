import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'Affiliate Tracking' }) {
  const router = useRouter();
  const affiliateId = router.query.affiliate_id;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Affiliate postback tracking system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Affiliate Tracker
                </Link>
              </div>
              
              {affiliateId && (
                <div className="flex items-center space-x-4">
                  <Link 
                    href={`/dashboard/${affiliateId}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname.includes('/dashboard') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href={`/postback-url/${affiliateId}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      router.pathname.includes('/postback-url') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Postback URL
                  </Link>
                  <Link 
                    href="/"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Switch Affiliate
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </>
  );
}
