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
        hostname: "vseehvj7twlup2mp.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
