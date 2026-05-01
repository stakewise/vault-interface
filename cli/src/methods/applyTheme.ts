import { join } from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'

import {
  baseDarkFn,
  baseLightFn,
  baseDarkRgb,
  baseLightRgb,
  settingsDarkPrimary,
  settingsLightPrimary,
} from '../constants'
import { safeReplace, hexToRgb } from '../helpers'


const applyTheme = async (targetDir: string, light: string, dark: string): Promise<void> => {
  const settingsPath = join(targetDir, 'src/styles/settings.scss')
  const baseCssPath = join(targetDir, 'src/styles/tailwind/layers/base.css')

  const settings = await readFile(settingsPath, 'utf8')

  let nextSettings = safeReplace({
    content: settings,
    search: settingsLightPrimary,
    replacement: `'primary': ${light},`,
    label: 'light primary in settings.scss',
  })

  nextSettings = safeReplace({
    content: nextSettings,
    search: settingsDarkPrimary,
    replacement: `'primary': ${dark},`,
    label: 'dark primary in settings.scss',
  })

  await writeFile(settingsPath, nextSettings, 'utf8')

  const [ lr, lg, lb ] = hexToRgb(light)
  const [ dr, dg, db ] = hexToRgb(dark)

  const baseCss = await readFile(baseCssPath, 'utf8')

  let nextBase = safeReplace({
    content: baseCss,
    search: baseLightRgb,
    replacement: `--primary-rgb: ${lr}, ${lg}, ${lb};`,
    label: 'light --primary-rgb',
  })

  nextBase = safeReplace({
    content: nextBase,
    search: baseLightFn,
    replacement: `--primary: rgb(${lr}, ${lg}, ${lb});`,
    label: 'light --primary',
  })

  nextBase = safeReplace({
    content: nextBase,
    search: baseDarkRgb,
    replacement: `--primary-rgb: ${dr}, ${dg}, ${db};`,
    label: 'dark --primary-rgb',
  })

  nextBase = safeReplace({
    content: nextBase,
    search: baseDarkFn,
    replacement: `--primary: rgb(${dr}, ${dg}, ${db});`,
    label: 'dark --primary',
  })

  await writeFile(baseCssPath, nextBase, 'utf8')
}


export default applyTheme
