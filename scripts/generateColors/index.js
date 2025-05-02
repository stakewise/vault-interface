const fs = require('fs')
const path = require('path')
const hexToRgb = require('./hexToRgb')


const destBase = path.resolve(__dirname, `../../src/styles/tailwind/layers/base.css`)
const destTheme = path.resolve(__dirname, `../../src/styles/tailwind/theme.css`)
const destColors = path.resolve(__dirname, `../../src/styles/settings.scss`)

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
      colors[formattedTitle] = hexToRgb(value)
    }
  })

  return colors
}

const generateThemeColors = (theme) => {
  const colors = getColors(theme)

  let baseColorsString = ''
  let themeColorsString = ''

  Object.keys(colors).forEach((color) => {
    const baseColor = colors[color]

    baseColorsString += `    --${color}-rgb: ${baseColor};\n`
    baseColorsString += `    --${color}: rgb(${baseColor});\n`
    themeColorsString += `  --color-${color}: var(--${color});\n`
  })

  return [
    `:root .body-${theme}-theme {\n${baseColorsString}  }`,
    themeColorsString,
  ]
}

const themes = [ 'light', 'dark' ]

const generateColors = () => {
  themes.forEach((theme) => {
    const [ colorsBase, colorsTheme ] = generateThemeColors(theme)

    const baseFile = fs.readFileSync(destBase, 'utf8')
    const themeFile = fs.readFileSync(destTheme, 'utf8')

    const newBaseFile = baseFile
      .replace(new RegExp(`:root .body-${theme}-theme {[^}]*}`), colorsBase)

    const newThemeFile = themeFile
      .replace(/\/\* Colors \*\/(.|\n)*\/\* Border radius \*\//, `/* Colors */\n${colorsTheme}\n  /* Border radius */`)

    fs.writeFileSync(destBase, newBaseFile, 'utf8')
    fs.writeFileSync(destTheme, newThemeFile, 'utf8')
  })
}


generateColors()
