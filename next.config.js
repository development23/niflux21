const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];
module.exports = {
  swcMinify: false,
  // env: {
  //   DATABASE_CONNECTION:
  //     "mongodb+srv://propertycheckkro:BO5zFaALYxjSFvmR@cluster0.u6poy.mongodb.net/manglam?retryWrites=true&w=majority",
  //   BASE_URL: "http://192.168.0.35:3000/",
  //   NEXTAUTH_URL: "http://192.168.0.35:3000/",
  //   DB_NAME: "manglam",
  // },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["res.cloudinary.com"],
    minimumCacheTTL: 60,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
