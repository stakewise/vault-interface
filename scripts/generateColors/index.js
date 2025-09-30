const fs = require('fs')
const path = require('path')
const hexToRgb = require('./hexToRgb')


const themes = [ 'light', 'dark' ]

const destVariables = path.resolve(__dirname, `../../src/styles/variables.scss`)
const destColors = path.resolve(__dirname, `../../src/styles/settings.scss`)
const destTheme = path.resolve(__dirname, `../../src/styles/tailwind/theme.css`)
const destBase = path.resolve(__dirname, `../../src/styles/tailwind/layers/base.css`)

const getColors = () => {
  const colorsFile = fs.readFileSync(destColors, 'utf8')
  const colors = {
    light: {},
    dark: {},
  }

  const colorsStrings = {
    light: colorsFile.replace(/\$colors-light-theme: \(\n|\);(.|\n)*/g, ''),
    dark: colorsFile.replace(/(.|\n)*\$colors-dark-theme: \(\n|\);\n?/, ''),
  }

  Object.keys(colorsStrings).forEach((theme) => {
    const colorsString = colorsStrings[theme]

    colorsString.split(',').forEach((colorString) => {
      const [ title, value ] = colorString.split(': ')

      const formattedTitle = title.replace(/\n|\s|'/g, '')

      if (formattedTitle && value) {
        colors[theme][formattedTitle] = {
          hex: value,
          rgb: hexToRgb(value),
          isGradientColor: /-(start|end)$/.test(formattedTitle)
        }
      }
    })
  })

  return colors
}

const generateThemeColors = () => {
  const themeColors = getColors()

  const baseColors = {
    light: '',
    dark: '',
  }

  let themeColorsString = ''
  let variablesColorsString = ''

  themes.forEach((theme, index) => {
    const colors = themeColors[theme]

    Object.keys(colors).forEach((color) => {
      const { hex, rgb, isGradientColor } = colors[color]

      baseColors[theme] += `    --${color}-rgb: ${rgb};\n`
      baseColors[theme] += `    --${color}: rgb(${rgb});\n`

      if (!index) {
        themeColorsString += `  --color-${color}: var(--${color});\n`

        if (!isGradientColor) {
          variablesColorsString += `$color-${color}: var(--${color});\n`
          variablesColorsString += `$color-${color}-rgb: var(--${color}-rgb);\n`
        }
      }

      if (isGradientColor) {
        variablesColorsString += `$color-${color}-${theme}: ${hex};\n`
      }
    })
  })

  return [
    baseColors,
    themeColorsString,
    variablesColorsString,
  ]
}

const generateColors = () => {
  const [ colorsBase, colorsTheme, colorsVariables ] = generateThemeColors()

  const baseFile = fs.readFileSync(destBase, 'utf8')
  const themeFile = fs.readFileSync(destTheme, 'utf8')
  const variablesFile = fs.readFileSync(destVariables, 'utf8')

  let newBaseFile = baseFile

  Object.keys(colorsBase).forEach((theme) => {
    newBaseFile = newBaseFile
      .replace(
        new RegExp(`:root .body-${theme}-theme {[^}]*}\n`, 'g'),
        `:root .body-${theme}-theme {\n${colorsBase[theme]}  }\n`,
      )
  })

  const newThemeFile = themeFile
    .replace(/\/\* Colors \*\/(.|\n)*\/\* Border radius \*\//, `/* Colors */\n${colorsTheme}\n  /* Border radius */`)

  const newVariablesFile = variablesFile
    .replace(/\/\/ Colors\n(.|\n)*/, `// Colors\n${colorsVariables}`)

  fs.writeFileSync(destBase, newBaseFile, 'utf8')
  fs.writeFileSync(destTheme, newThemeFile, 'utf8')
  fs.writeFileSync(destVariables, newVariablesFile, 'utf8')
}


generateColors()
