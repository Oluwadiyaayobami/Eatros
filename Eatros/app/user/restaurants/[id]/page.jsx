/**
 * Restaurant Detail Page - Server Component
 *
 * Handles all SEO concerns on the server:
 * - generateMetadata: fetches vendor profile and returns dynamic title/description
 * - JSON-LD: injects LocalBusiness structured data with AggregateRating
 *
 * The interactive UI is delegated to RestaurantClient (a Client Component).
 */

import RestaurantClient from './RestaurantClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eatros.com';

/**
 * Server-side helper to fetch vendor profile without needing auth token.
 * Falls back gracefully when the API is unavailable (e.g., during build).
 */
async function getVendorProfile(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/vendor/${id}/profile`, {
      // Cache for 1 hour on the CDN edge, revalidate in background
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.vendor ?? null;
  } catch {
    return null;
  }
}

// ─── Dynamic Metadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { id } = await params;
  const vendor = await getVendorProfile(id);

  if (!vendor) {
    return {
      title: 'Restaurant | Eatros',
      description: 'Discover amazing food and order online with Eatros.',
    };
  }

  const vd = vendor.vendorDetails || {};
  const name = vd.restaurantName || 'Restaurant';
  const coverImage = vd.coverImage || '/images/og-image.jpg';
  const rating = vd.rating ? `⭐ ${vd.rating}/5` : '';
  const description = `Order from ${name} on Eatros. ${rating} Discover our menu, place your order, and enjoy fast delivery or pickup.`.trim();

  return {
    title: `Order from ${name} | Eatros`,
    description,
    alternates: {
      canonical: `${SITE_URL}/user/restaurants/${id}`,
    },
    openGraph: {
      title: `${name} — Order Online | Eatros`,
      description,
      url: `${SITE_URL}/user/restaurants/${id}`,
      siteName: 'Eatros',
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: `${name} cover photo`,
        },
      ],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — Order Online | Eatros`,
      description,
      images: [coverImage],
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function RestaurantPage({ params }) {
  const { id } = await params;
  const vendor = await getVendorProfile(id);
  const vd = vendor?.vendorDetails || {};

  const name = vd.restaurantName || 'Restaurant';
  const coverImage = vd.coverImage || '/images/og-image.jpg';
  const profileImage = vd.profileImage || '/images/og-image.jpg';
  const rating = vd.rating || 0;
  const ratingCount = vd.ratingCount || 0;

  // ── JSON-LD: Restaurant (LocalBusiness) Schema ──────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/user/restaurants/${id}`,
    name,
    url: `${SITE_URL}/user/restaurants/${id}`,
    image: [coverImage, profileImage].filter(Boolean),
    ...(ratingCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toFixed(1),
        ratingCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    servesCuisine: vd.category || 'Various',
    priceRange: '₦₦',
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Cash, Credit Card',
    potentialAction: {
      '@type': 'OrderAction',
      target: `${SITE_URL}/user/restaurants/${id}`,
    },
  };

  // ── Breadcrumb Schema ───────────────────────────────────────────────────────
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Restaurants',
        item: `${SITE_URL}/user/restaurants`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name,
        item: `${SITE_URL}/user/restaurants/${id}`,
      },
    ],
  };

  return (
    <>
      {/* Restaurant JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Hand off to the interactive Client Component */}
      <RestaurantClient />
    </>
  );
}