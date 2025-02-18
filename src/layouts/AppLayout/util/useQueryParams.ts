import { useEffect } from 'react'
import { constants } from 'helpers'
import { localStorage } from 'sdk'
import { useSearchParams } from 'next/navigation'


// We can lose query parameters as we go through the pages. It is better to save them for the
// whole session and use them from anywhere in the application
const useQueryParams = () => {
  const query = useSearchParams()

  useEffect(() => {
    if (query) {
      const supportedQueryNames = Object.values(constants.queryNames)

      supportedQueryNames.forEach((name) => {
        const value = query.get(name)
        const savedValue = localStorage.getSessionItem(name)

        if (value) {
          localStorage.setSessionItem(name, value)
        }
        else if (savedValue) {
          localStorage.removeSessionItem(name)
        }
      })
    }
  }, [ query ])
}


export default useQueryParams
