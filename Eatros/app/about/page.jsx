import AboutClientUI from "./AboutClientUI";

export const metadata = {
  title: "About Us | Eatros & Leadership Team",
  description: "Learn about our vision, our mission, and the leadership team driving innovation behind our platform. Meet our CEO and CTO.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About Us | Eatros & Leadership Team",
    description: "Learn about our vision, our mission, and the leadership team.",
    url: '/about',
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
    title: "About Us | Eatros & Leadership Team",
    description: "Learn about our vision, our mission, and the leadership team.",
    images: ['/images/og-image.jpg'],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://eatros.com/#organization",
        "name": "Eatros",
        "url": "https://eatros.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://eatros.com/images/logo.png"
        },
        "description": "Innovative Software Solutions for food delivery and restaurant management."
      },
      {
        "@type": "Person",
        "@id": "https://eatros.com/#ceo",
        "name": "Akomolafe Folarin O.",
        "jobTitle": "Chief Executive Officer",
        "worksFor": {
          "@id": "https://eatros.com/#organization"
        },
        "description": "Visionary leader spearheading strategic growth, business operations, and tech-driven transformation."
      },
      {
        "@type": "Person",
        "@id": "https://eatros.com/#cto",
        "name": "Oluwadiya Ayobami Bright",
        "jobTitle": "Chief Technology Officer",
        "worksFor": {
          "@id": "https://eatros.com/#organization"
        },
        "description": "Lead Software Architect and Computer Science scholar at Achievers University, Owo. Specialist in full-stack web architectures, scalable backend infrastructures, and real-time platforms."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClientUI />
    </>
  );
}
