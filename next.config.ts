import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Em produção, defina ALLOWED_ORIGINS com o domínio real (ex: "app.empresa.com")
      allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
        : ["localhost:3000"],
    },
  },
};

export default nextConfig;
