/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/docs/overview/introduction",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
