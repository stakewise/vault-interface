import { useCallback } from 'react'
import { BigDecimal } from 'sdk'
import { parseEther } from 'ethers'
import { useConfig } from 'config'

import useVaultDays from './useVaultDays'


const useUserRewards = (vaultAddress: string) => {
  const { sdk, address } = useConfig()

  const fetchDaysSinceVaultCreation = useVaultDays(vaultAddress)

  return useCallback(async () => {
    if (!address) {
      return 0n
    }

    const daysCount = await fetchDaysSinceVaultCreation()

    const data = await sdk.vault.getUserStats({
      userAddress: address,
      vaultAddress,
      daysCount,
    })

    const rewards = data.rewards.reduce((acc, item) => {
      return new BigDecimal(acc).plus(item.value).toNumber()
    }, 0)

    return parseEther(new BigDecimal(rewards).toString())
  }, [ sdk, address, vaultAddress, fetchDaysSinceVaultCreation ])
}


export default useUserRewards
