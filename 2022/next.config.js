// eslint-disable-next-line no-process-env
const basePath = process.env.BASE_PATH;
/** @type {import('next').NextConfig} */
module.exports = {
  basePath,
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    outputStandalone: true,
  },
};
