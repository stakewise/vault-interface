const path = require('path')
const generateName = require('css-class-generator')


const regexEqual = (x, y) => (
  x instanceof RegExp
  && y instanceof RegExp
  && x.source === y.source
  && x.global === y.global
  && x.ignoreCase === y.ignoreCase
  && x.multiline === y.multiline
)

const keysToNames = {}
const names = {}
let index = 0

const getName = (key) => {
  if (names[key]) {
    return names[key]
  }

  const name = generateName(index++)

  if (name in keysToNames) {
    throw new Error(`Found duplicate class name "${name}" generated for key "${key}"`)
  }

  keysToNames[name] = true
  names[key] = name

  return name
}

const getLocalIdent = ({ rootContext, resourcePath }, _, name) => {
  const key = `${path.relative(rootContext, resourcePath).replace(/\\+/g, '/')}#${name}`

  return getName(key)
}

// https://dhanrajsp.me/snippets/customize-css-loader-options-in-nextjs

const compressCssModules = (config) => {
  const oneOf = config.module.rules.find((rule) => typeof rule.oneOf === 'object')

  if (oneOf) {
    // Find the module which targets *.scss|*.sass files
    const moduleSassRule = oneOf.oneOf.find((rule) =>
      regexEqual(rule.test, /\.module\.(scss|sass)$/)
    )

    if (moduleSassRule) {
      // Get the config object for css-loader plugin
      const cssLoader = moduleSassRule.use.find(({ loader }) => loader?.includes('css-loader'))

      if (cssLoader) {
        cssLoader.options = {
          ...cssLoader.options,
          modules: {
            ...cssLoader.options.modules,
            getLocalIdent,
          },
        }
      }
    }
  }

  return {
    ...config,
    cache: false,
  }
}


module.exports = compressCssModules
