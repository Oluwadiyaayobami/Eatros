import TermsClientUI from "./TermsClientUI";

export const metadata = {
  title: "Terms of Service | Eatros - User & Merchant Agreement",
  description: "Read the Eatros Terms of Service governing platform usage, food ordering, merchant relationships, delivery operations, and payment policies.",
  alternates: {
    canonical: '/term',
  },
  openGraph: {
    title: "Terms of Service | Eatros",
    description: "Terms and conditions governing the Eatros food delivery marketplace.",
    url: '/term',
    siteName: 'Eatros',
    images: [
      {
        url: '/eatrologo.jpeg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms of Service | Eatros",
    description: "Terms and conditions governing the Eatros food delivery marketplace.",
    images: ['/eatrologo.jpeg'],
  },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service",
    "url": "https://eatro.shop/term",
    "description": "Eatros Terms and Conditions governing consumer orders, restaurant partnerships, and delivery logistics.",
    "publisher": {
      "@type": "Organization",
      "name": "Eatros",
      "url": "https://eatro.shop",
      "logo": "https://eatro.shop/eatrologo.jpeg"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TermsClientUI />
    </>
  );
}
