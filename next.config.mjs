/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    siteDescription: "Admin dashboard site for managing penaly client side",
    siteKeywords: "Article, Blog, Education",
    siteUrl: "http://localhost:3000",
    siteTitle: "Penaly"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ]
  }
};

export default nextConfig;
