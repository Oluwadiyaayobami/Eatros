import HomeClient from "./HomeClient";

export const metadata = {
  title: "Eatro | Food Delivery & Restaurant Management",
  description: "Eatro is an innovative food tech platform revolutionizing restaurant management and food delivery. We seamlessly connect hungry consumers with local restaurants and independent delivery agents.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Eatro | Food Delivery & Restaurant Management",
    description: "Eatro is an innovative food tech platform revolutionizing restaurant management and food delivery. We seamlessly connect hungry consumers with local restaurants and independent delivery agents.",
    url: '/',
    siteName: 'Eatro',
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
    title: "Eatro | Food Delivery & Restaurant Management",
    description: "Eatro is an innovative food tech platform revolutionizing restaurant management and food delivery. We seamlessly connect hungry consumers with local restaurants and independent delivery agents.",
    images: ['/eatrologo.jpeg'],
  },
};

export default function Home() {
  return <HomeClient />;
}
