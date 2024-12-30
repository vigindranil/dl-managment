/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com", // Replace with the domain of your image URL
      },
    ],
  },
};
export default nextConfig;
