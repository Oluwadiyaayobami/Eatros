// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Eatro",
  description: "Eatro is your premier food delivery service. We Deliver. You Enjoy. Discover and order from a wide variety of local restaurants with fast, reliable, and convenient delivery straight to your door.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eatro",
  },
};

export const viewport = {
  themeColor: "#FF5722",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        {children}
      </body>
    </html>
  );
}
