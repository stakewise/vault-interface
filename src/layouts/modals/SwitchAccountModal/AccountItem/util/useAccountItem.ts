import { useState, useEffect, useMemo, useCallback } from 'react'
import cacheStorage from 'modules/cache-storage'
import { formatEther } from 'ethers'
import { useConfig } from 'config'
import { methods } from 'helpers'

import type { AccountItemProps } from '../AccountItem'


type Output = {
  shortenAddress: string
  token: Tokens
  balance: string | undefined
  handleClick: () => void
}

type Cache = { [address: string]: string }

const cache = cacheStorage.get<Cache>(UNIQUE_FILE_ID)
cache.setData({})

const useAccountItem = (values: AccountItemProps): Output => {
  const { address, isActive, onClick } = values

  const cachedData = cache.getData() || {}
  const cachedValue = cachedData[address]

  const { sdk, readOnlyProvider } = useConfig()
  const [ balance, setBalance ] = useState<string>(cachedValue)

  useEffect(() => {
    if (!cachedValue && readOnlyProvider.getBalance) {
      readOnlyProvider.getBalance(address)
        .then((value: bigint) => {
          const formattedValue = methods.formatTokenValue(formatEther(value))

          setBalance(formattedValue)

          cache.setData({
            ...cachedData,
            [address]: formattedValue,
          })
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = useCallback(() => {
    if (!isActive) {
      onClick(address)
    }
  }, [ address, isActive, onClick ])

  return useMemo(() => ({
    balance,
    token: sdk.config.tokens.nativeToken,
    shortenAddress: methods.shortenAddress(address, -4),
    handleClick,
  }), [ sdk, address, balance, handleClick ])
}


export default useAccountItem
