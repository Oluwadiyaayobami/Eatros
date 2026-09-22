import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatros.shop';
  
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/register/agent', '/register/vendor', '/login', '/register'],
      disallow: ['/dashboard/', '/admin/', '/api/', '/_next/', '/static/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
