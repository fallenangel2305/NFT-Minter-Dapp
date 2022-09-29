/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: [
      'arweave.net',
      'testdoc.mvp-apps.ae',
      'ipfs.infura.io',
      'shopmints.neft.world',
    ],
  },
  env: {
    TOKEN_ACCOUNT_TO_SEARCH: process.env.TOKEN_ACCOUNT_TO_SEARCH,
    NFT_STORAGE_API: process.env.NFT_STORAGE_API,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
