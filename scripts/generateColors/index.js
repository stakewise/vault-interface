const fs = require('fs')
const path = require('path')
const hexToRgb = require('./hexToRgb')

const themes = [ 'light', 'dark' ]

const destVariables = path.resolve(__dirname, `../../src/styles/variables.scss`)
const destColors = path.resolve(__dirname, `../../src/styles/settings.scss`)
const destTheme = path.resolve(__dirname, `../../src/styles/tailwind/theme.css`)
const destBase = path.resolve(__dirname, `../../src/styles/tailwind/layers/base.css`)

const getColors = (theme) => {
  const colorsFile = fs.readFileSync(destColors, 'utf8')
  const colors = {}

  const colorsString = theme === 'light'
    ? colorsFile.replace(/\$colors-light-theme: \(\n|\);(.|\n)*/g, '')
    : colorsFile.replace(/(.|\n)*\$colors-dark-theme: \(\n|\);\n?/, '')

  colorsString.split(',').forEach((colorString) => {
    const [ title, value ] = colorString.split(': ')

    const formattedTitle = title.replace(/\n|\s|'/g, '')

    if (formattedTitle && value) {
      colors[formattedTitle] = {
        hex: value,
        rgb: hexToRgb(value),
      }
    }
  })

  return colors
}

const generateThemeColors = () => {
  const themeColors = {
    light: getColors('light'),
    dark: getColors('dark'),
  }

  const baseColors = {
    light: '',
    dark: '',
  }

  let themeColorsString = ''
  let variablesColorsString = ''

  themes.forEach((theme, index) => {
    const colors = themeColors[theme]

    Object.keys(colors).forEach((color) => {
      const { hex, rgb } = colors[color]

      const isGradientColor = /-(start|end)$/.test(color)

      if (isGradientColor) {
        const colorTitle = color.replace(/-(start|end)$/, '')
        const isThemeColor = (
          themeColors.dark[`${colorTitle}-start`].hex !== themeColors.light[`${colorTitle}-start`].hex
          || themeColors.dark[`${colorTitle}-end`].hex !== themeColors.light[`${colorTitle}-end`].hex
        )

        if (isThemeColor) {
          variablesColorsString += `$color-${color}-${theme}: ${hex};\n`
        }
        else if (!index) {
          variablesColorsString += `$color-${color}: ${hex};\n`
        }
      }
      else {
        baseColors[theme] += `    --${color}-rgb: ${rgb};\n`
        baseColors[theme] += `    --${color}: rgb(${rgb});\n`

        if (!index) {
          themeColorsString += `  --color-${color}: var(--${color});\n`

          variablesColorsString += `$color-${color}: var(--${color});\n`
          variablesColorsString += `$color-${color}-rgb: var(--${color}-rgb);\n`
        }
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

  Object.keys(colorsBase).forEach((theme, index) => {
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
