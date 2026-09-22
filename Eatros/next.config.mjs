import withPWAInit from "@ducanh2912/next-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      // Ensure @/* resolves to the project root in Turbopack (dev server)
      "@": path.resolve(__dirname, "."),
    },
  },
  webpack(config) {
    // Ensure @/* resolves in the production Webpack build
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "."),
    };
    return config;
  },
  async rewrites() {
    return [
      { source: '/login', destination: '/auth/login' },
      { source: '/register', destination: '/auth/user/register' },
      { source: '/register/agent', destination: '/auth/agent' },
      { source: '/register/vendor', destination: '/auth/vendor' },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withPWA(nextConfig);