/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    env: {
      NEXTAUTH_URL: "http://localhost:3000",
      NEXTAUTH_SECRET: "super-secret-key",
    },
    cookies: {
      sessionToken: {
        name: "next-auth.session-token",
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // 🔥 Secure seulement en production
          path: "/",
        },
      },
    },
  };
  
  export default nextConfig;
  