// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'theme905-computer-shop.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'ecomapi.ftdigitalsolutions.org',
      },
      {
        protocol: 'https',
        hostname: 'www.primeabgb.com',
      },
    ],
  },
};

module.exports = nextConfig;
