import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatros.shop';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetches all public vendor IDs for dynamic sitemap generation.
 * Falls back to an empty array gracefully if the API is unreachable at build time.
 */
async function getAllVendorIds(): Promise<Array<{ id: string; updatedAt?: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/vendor/list`, {
      next: { revalidate: 86400 }, // Revalidate sitemap once per day
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Handle both { vendors: [...] } and flat array responses
    const vendors = Array.isArray(data) ? data : (data.vendors ?? []);
    return vendors.map((v: { _id?: string; id?: string; updatedAt?: string }) => ({
      id: v._id ?? v.id ?? '',
      updatedAt: v.updatedAt,
    })).filter((v: { id: string }) => v.id);
  } catch {
    // API not yet available (e.g., during static build)
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ── Static public pages ────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    // Home
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // About (Company & Leadership)
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Auth - Login (mapped via rewrite from /auth/login)
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    // Auth - User Registration (mapped via rewrite from /auth/user/register)
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    // Auth - Agent Registration (mapped via rewrite from /auth/agent/register)
    {
      url: `${baseUrl}/register/agent`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Auth - Vendor Landing Page (mapped via rewrite from /auth/vendor)
    {
      url: `${baseUrl}/register/vendor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // ── Dynamic restaurant/vendor pages ───────────────────────────────────────
  const vendors = await getAllVendorIds();

  const dynamicRoutes: MetadataRoute.Sitemap = vendors.map(({ id, updatedAt }) => ({
    url: `${baseUrl}/user/restaurants/${id}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
