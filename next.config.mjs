// next.config.mjs
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
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
