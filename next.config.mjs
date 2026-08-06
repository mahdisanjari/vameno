/** @type {import('next').NextConfig} */
const nextConfig = {
  // Overridable so a build can be verified without touching an existing
  // .next owned by another user (e.g. left behind by a sudo build).
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
