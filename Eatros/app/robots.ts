import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/register/agent', '/register/vendor', '/login', '/register'],
      disallow: ['/dashboard/', '/admin/', '/api/', '/_next/', '/static/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
