import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Websters - The Computer Science Society',
  description: 'We could not find the page you were looking for. Please navigate back to our homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          We couldn't find the page you were looking for. It might have been removed, 
          renamed, or didn't exist in the first place.
        </p>
        <Link 
          href="/"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
} 