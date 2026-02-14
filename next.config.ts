import type { NextConfig } from "next";

// En Vercel, NEXTAUTH_URL se usa para que la cookie de sesión tenga el dominio correcto.
// Si no está definida, la rellenamos desde VERCEL_URL (Vercel la inyecta automáticamente).
const vercelUrl = process.env.VERCEL_URL;
const nextAuthUrl =
  process.env.NEXTAUTH_URL ||
  (vercelUrl ? `https://${vercelUrl}` : undefined);

const nextConfig: NextConfig = {
  transpilePackages: ["react-quill"],
  env: nextAuthUrl ? { NEXTAUTH_URL: nextAuthUrl } : {},
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
