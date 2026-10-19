import PrivacyClientUI from "./PrivacyClientUI";

export const metadata = {
  title: "Privacy Policy | Eatros - Your Data & Privacy Protected",
  description: "Learn how Eatros collects, uses, and safeguards your personal data, location information, and payment details across our food delivery platform.",
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: "Privacy Policy | Eatros",
    description: "Learn how Eatros collects, uses, and protects your personal data and privacy.",
    url: '/privacy',
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
    title: "Privacy Policy | Eatros",
    description: "Learn how Eatros collects, uses, and protects your personal data and privacy.",
    images: ['/eatrologo.jpeg'],
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "url": "https://eatro.shop/privacy",
    "description": "Eatros Privacy Policy explaining data collection, protection, and user rights.",
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
      <PrivacyClientUI />
    </>
  );
}
