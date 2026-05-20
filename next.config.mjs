// next.config.mjs
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coloiwvo00tghivx.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
