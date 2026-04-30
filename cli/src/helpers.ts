import { execa } from 'execa'
import prompts from 'prompts'
import pc from 'picocolors'

import { promptOptions } from './constants'


export const isUrl = (value: string): boolean => /^https?:\/\/.+/i.test(String(value).trim())

export const isAddress = (value: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(String(value).trim())

export const isHexColor = (value: string): boolean => /^#[0-9a-fA-F]{6}$/.test(String(value).trim())

export const ask = <T extends string = string>(question: prompts.PromptObject<T>) => prompts(question, promptOptions)

export const hexToRgb = (hex: string): [ number, number, number ] => {
  const trimmed = hex.replace('#', '')

  return [
    parseInt(trimmed.slice(0, 2), 16),
    parseInt(trimmed.slice(2, 4), 16),
    parseInt(trimmed.slice(4, 6), 16),
  ]
}

export const hasCommand = async (cmd: string): Promise<boolean> => {
  try {
    await execa(process.platform === 'win32' ? 'where' : 'which', [ cmd ])

    return true
  }
  catch {
    return false
  }
}

export const log = (value: string | string[]) => console.log(`
${Array.isArray(value) ? value.join('\n') : value}
`)

type SafeReplaceInput = {
  replacement: string
  content: string
  search: string
  label: string
}

export const safeReplace = (values: SafeReplaceInput): string => {
  const { replacement, content, search, label } = values

  if (!content.includes(search)) {
    log(pc.yellow(`  Warning: "${label}" not found in source — skipping`))

    return content
  }

  return content.replace(search, replacement)
}
