import type { NextConfig } from "next";

// TODO: Add the correct image hostnames as env variables
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
      },
      {
        protocol: 'https',
        hostname: 'your-storage-account.blob.core.windows.net', 
        pathname: '/your-container-name/**',
      },
      {
        protocol: 'https',
        hostname: 'img.your-app.com', 
      },
    ],
  },
};

export default nextConfig;