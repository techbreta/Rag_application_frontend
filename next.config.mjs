/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Prevent lint warnings from failing Vercel production builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const backendUrl = (
      process.env.NEXT_PUBLIC_API_URL || "https://rag-application-backend-xi.vercel.app"
    ).replace(/\/+$/, "");

    return [
      {
        source: "/sitemap.xml",
        destination: `${backendUrl}/sitemap.xml`,
      },
      {
        source: "/robots.txt",
        destination: `${backendUrl}/robots.txt`,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // konva/canvas is only needed client-side; stub it out during SSR builds
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({ canvas: "commonjs canvas" });
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
};

export default nextConfig;

