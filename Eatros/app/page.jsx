import HomeClient from "./HomeClient";

export const metadata = {
  title: "Home | Eatros Platform",
  description: "Welcome to Eatros, the comprehensive platform for food delivery, restaurant management, and agent networking.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Home | Eatros Platform",
    description: "Welcome to Eatros, the comprehensive platform.",
    url: '/',
    siteName: 'Eatros',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Home | Eatros Platform",
    description: "Welcome to Eatros, the comprehensive platform.",
    images: ['/images/og-image.jpg'],
  },
};

export default function Home() {
  return <HomeClient />;
}
