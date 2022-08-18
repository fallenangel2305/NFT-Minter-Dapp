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
  }
}

module.exports = nextConfig
