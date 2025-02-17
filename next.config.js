const path = require('path')

const baseConfig = require('./scripts/next.config.base')


/**
 * @type {import('next').NextConfig}
 */
let nextConfig = {
  ...baseConfig,
  sassOptions: {
    additionalData: `@import 'scss/index.scss';`,
    includePaths: [
      path.join(__dirname, 'src/scss'),
    ],
  },
}


module.exports = nextConfig
