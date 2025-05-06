const path = require('path')

const baseConfig = require('./scripts/next.config.base')


/**
 * @type {import('next').NextConfig}
 */
let nextConfig = {
  ...baseConfig,
  sassOptions: {
    additionalData: `
      @use 'src/styles/variables' as *;
      @use 'src/styles/mixins/media' as *;
      @use 'src/styles/mixins/common' as *;
      @use 'src/styles/mixins/animation' as *;
    `,
    includePaths: [
      path.join(__dirname, 'src', 'styles'),
    ],
  },
}


module.exports = nextConfig
