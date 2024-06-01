/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "real-time-app-anonymous.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
