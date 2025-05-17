/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint during build
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'], // Add your image domains here
  },
};

export default nextConfig;