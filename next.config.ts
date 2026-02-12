import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-quill"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
