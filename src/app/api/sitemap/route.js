import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://webstersshivaji.vercel.app';
  
  // Define your website's main pages and their metadata
  const pages = [
    {
      url: '/',
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: '/techelons',
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/register-options',
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: '/techelonsregistration',
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: '/workshopregistration',
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

  // Return the XML sitemap with appropriate headers
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
} 