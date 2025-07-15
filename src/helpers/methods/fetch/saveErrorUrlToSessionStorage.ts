import { localStorage } from 'sdk'
import * as constants from 'helpers/constants'


const sessionErrorUrl = constants.sessionStorageNames.moduleErrorUrl

const saveErrorUrlToSessionStorage = (baseUrl: string): void => {
  const current = localStorage.getSessionItem<string>(sessionErrorUrl)

  if (current !== baseUrl) {
    localStorage.setSessionItem(sessionErrorUrl, baseUrl)

    setTimeout(() => {
      localStorage.removeSessionItem(sessionErrorUrl)
    },  60 * 60 * 1000) // 1 hour
  }
}


export default saveErrorUrlToSessionStorage
