import { useCallback, useEffect, useRef } from 'react'
import { getters, requests } from 'helpers'
import { useConfig } from 'config'


const day = 24 * 60 * 60

const useVaultDays = (vaultAddress: string) => {
  const { sdk } = useConfig()

  const daysCountRef = useRef<number | null>(null)

  useEffect(() => {
    daysCountRef.current = null
  }, [ vaultAddress ])

  return useCallback(async () => {
    if (daysCountRef.current) {
      return daysCountRef.current
    }

    if (vaultAddress) {
      const data = await requests.fetchCreatedAt({
        url: sdk.config.api.subgraph,
        variables: {
          address: vaultAddress.toLowerCase(),
        },
      })

      const createdTime = Number(data?.vault?.createdAt || 0) * 1000
      const startOfDay = getters.unixDate.getUnixStartOfDay()

      const time = createdTime / 1000

      let vaultCreationDay = startOfDay

      if (time < startOfDay) {
        const daysOffset = Math.ceil((startOfDay - time) / day)

        vaultCreationDay = getters.unixDate.getUnixStartOfDayOffset(daysOffset)
      }

      const timeDiff = startOfDay - vaultCreationDay

      daysCountRef.current = Math.ceil(timeDiff / day)

      return daysCountRef.current
    }

    return 0
  }, [ sdk, vaultAddress ])
}


export default useVaultDays
