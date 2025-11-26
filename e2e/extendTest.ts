import { test as base } from '@guardianui/test'

import {
  sdk,
  user,
  swap,
  queue,
  anvil,
  wallet,
  graphql,
  rewards,
  element,
  helpers,
  settings,
  guardian,
  transactions,
} from './fixtures'


const baseTest = base.extend<E2E.ExtendedTest>({
  sdk,
  user,
  swap,
  queue,
  anvil,
  wallet,
  rewards,
  graphql,
  element,
  helpers,
  settings,
  guardian,
  transactions,
})

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return minutes
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`
}

const log = {
  info: (text: string) => console.log(`\x1b[34m ${text} \x1b[0m`),
  error: (text: string) => console.log(`\x1b[31m ${text} \x1b[0m`),
  success: (text: string) => console.log(`\x1b[32m ${text} \x1b[0m`),
}

const getFileName = (value: string) => value.replace(/^.*\/(.*)\//gm, '$1/')

baseTest.afterEach(async ({}, testInfo) => {
  const { title, error, duration, file, retry } = testInfo

  const time = formatTime(duration)
  const fileName = getFileName(file)
  const retryStatus = retry > 0 ? `| Retry: ${retry}` : ''

  if (testInfo.status !== testInfo.expectedStatus) {
    log.error(`FAILED: ${title} (${fileName}) | Time: ${time} ${retryStatus}`)

    if (error) {
      log.error(`ERR: ${error.value || error.message}`)
    }
  }
  else {
    log.success(`SUCCESS: ${title} (${fileName}) | Time: ${time} ${retryStatus}`)
  }
})

baseTest.beforeEach(async ({}, testInfo) => {
  const fileName = getFileName(testInfo.file)

  log.info(`STARTED: ${testInfo.title} (${fileName})`)
})


export default baseTest
