import { localStorage } from 'sdk'

import type { ErrorRecord } from './types'


type Input = {
  baseUrl: string
  sessionErrorUrl: string
}

const expireTime = 60 * 60 * 1_000 // 1hr

const saveErrorUrlToSessionStorage = (input: Input): void => {
  const { baseUrl, sessionErrorUrl } = input

  const record: ErrorRecord = {
    url: baseUrl,
    expiresAt: Date.now() + expireTime
  }

  localStorage.setSessionItem(sessionErrorUrl, record)
}


export default saveErrorUrlToSessionStorage
