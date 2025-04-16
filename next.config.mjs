/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,  // Remove X-Powered-By header for security
  compress: true,  // Enable compression for better performance
  reactStrictMode: true,
  images: {
    domains: ['webstersshivaji.vercel.app'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Redirect from non-www to www (uncomment if using a custom domain)
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       has: [
  //         {
  //           type: 'host',
  //           value: 'webstersshivaji.com',
  //         },
  //       ],
  //       destination: 'https://www.webstersshivaji.com/:path*',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
