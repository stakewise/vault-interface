const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

const compressCssModules = require('./compressCssModules')


const mainRPC = process.env.NEXT_PUBLIC_MAINNET_NETWORK_URL
const fallbackRPC = process.env.NEXT_PUBLIC_MAINNET_FALLBACK_URL
const isProduction = process.env.NEXT_PUBLIC_IS_PROD !== 'false'

console.log('-------------------------------information---------------------------------')
console.log('Main RPC:', mainRPC)
console.log('Fallback RPC:', fallbackRPC)
console.log('This is production build:', isProduction ? 'YES' : 'NO')
console.log('---------------------------------------------------------------------------')

const baseConfig = {
  optimizeFonts: isProduction,
  reactStrictMode: false,
  transpilePackages: [
    'sw-core',
    'sw-hooks',
    'sw-store',
    'sw-methods',
    'sw-modules',
    'sw-helpers',
    'sw-components',
  ],
  sassOptions: {
    additionalData: `
      @import 'sw-components/scss/index.scss';
    `,
    includePaths: [
      path.join(__dirname, 'src/scss'),
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.stakewise.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: "Access-Control-Allow-Origin",
            value: '*',
          },
          {
            key: "Access-Control-Allow-Methods",
            value: 'GET',
          },
          {
            key: "Access-Control-Allow-Headers",
            value: 'X-Requested-With, content-type, Authorization',
          },
          {
            key: "Content-Security-Policy",
            // https://ethereum.stackexchange.com/questions/145491/getting-the-app-doesnt-support-safe-app-functionality
            value: "frame-ancestors 'self' https://app.safe.global https://holesky-safe.protofire.io https://*.blockscout.com;",
          },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        net: false,
        tls: false,
      },
    }

    config.externals.push(
      'pino-pretty'
    )

    config.plugins.push(
      new webpack.DefinePlugin({
        'IS_PROD': isProduction,
        // Creates a unique identifier where this variable is used in code
        'UNIQUE_FILE_ID': webpack.DefinePlugin.runtimeValue(
          (compiler) => {
            const filePath = compiler.module.resource

            return JSON.stringify(filePath)
          }, []
        ),
      }),
      new webpack.NormalModuleReplacementPlugin(/(.*\.graphql)$/m, (resource) => {
        resource.request = resource.request.replace(/(.*\.graphql)$/m, '$1.ts')
      })
    )

    const prefix = config.assetPrefix || ''
    const basePath = config.basePath || ''

    config.module.rules.push({
      test: /\.(mp4|webm|mov|ogg|swf|ogv)$/,
      use: [
        {
          loader: require.resolve('file-loader'),
          options: {
            publicPath: `${prefix || basePath}/_next/static/videos/`,
            outputPath: `static/videos/`,
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    })

    if (!isProduction) {
      config.plugins.push(
        new CircularDependencyPlugin({
          include: /src/,
          failOnError: true,
          cwd: process.cwd(),
          allowAsyncCycles: false,
          exclude: /a\.js|node_modules/,
        })
      )

      return config
    }

    config.optimization = {
      ...config.optimization,
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: true,
            mangle: true,
          },
        }),
      ],
    }

    return compressCssModules(config)
  },
}


module.exports = baseConfig
