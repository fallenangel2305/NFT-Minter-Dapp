/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      'arweave.net',
      'testdoc.mvp-apps.ae',
      'ipfs.infura.io',
      'shopmints.neft.world',
    ],
  }
}

module.exports = nextConfig
