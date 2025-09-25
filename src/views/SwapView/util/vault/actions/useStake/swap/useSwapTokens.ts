import { useEffect, useMemo, useState } from 'react'
import { swapTokens, swapTokenTitles, constants, getters } from 'helpers'
import { ZeroAddress } from 'ethers'
import { useConfig } from 'config'
import { useStore } from 'hooks'

import { LogoName } from 'components'


const storeSelector = (store: Store) => ({
  swapTokenRates: store.swapTokenRates.data,
  swapTokenBalances: store.account.swapTokenBalances.data,
  depositTokenBalance: store.account.balances.depositToken,
  isSwapTokenRatesFetching: store.swapTokenRates.isFetching,
  isSwapTokenBalancesFetching: store.account.swapTokenBalances.isFetching,
})

const useSwapTokens = () => {
  const { sdk, chainId, isMainnet } = useConfig()
  const [ selected, setSelected ] = useState<string>('')

  const {
    swapTokenRates,
    swapTokenBalances,
    depositTokenBalance,
    isSwapTokenRatesFetching,
    isSwapTokenBalancesFetching,
  } = useStore(storeSelector)

  const chainTokens = swapTokens[chainId as keyof typeof swapTokens]

  const depositToken = useMemo(() => ({
    logo: `token/${sdk.config.tokens.depositToken}` as LogoName,
    emptyBalance: constants.blockchain.emptyBalance,
    name: sdk.config.tokens.depositToken as string,
    title: isMainnet ? 'Ether' : 'Gnosis',
    balance: depositTokenBalance,
    address: null as string | null,
    units: 18,
  }), [ sdk, isMainnet, depositTokenBalance ])

  const list = useMemo(() => {
    const result = [ depositToken ]

    if (!chainTokens) {
      return result
    }

    const swapTokensList = Object.keys(chainTokens)
      .map((name) => {
        const address = chainTokens[name as keyof typeof chainTokens]
        const balance = swapTokenBalances[name] || 0n

        let units = 18
        let emptyBalance = constants.blockchain.emptyBalance

        if (/USD(T|C)/.test(name)) {
          units = 6
          emptyBalance = constants.blockchain.emptyBalance6
        }
        if (name === 'wBTC') {
          units = 8
          emptyBalance = constants.blockchain.emptyBalance8
        }

        return {
          title: swapTokenTitles[name as keyof typeof swapTokenTitles],
          name,
          units,
          address,
          balance,
          logo: `token/${name}` as LogoName,
          emptyBalance,
        }
      })
      .filter(({ name }) => swapTokenRates[name])
      .sort((a, b) => {
        if (a.balance > 0n && b.balance === 0n) {
          return -1
        }

        if (a.balance === 0n && b.balance > 0n) {
          return 1
        }

        return 0
      })

    return result.concat(swapTokensList)
  }, [ depositToken, chainTokens, swapTokenRates, swapTokenBalances ])

  const selectedToken = useMemo(() => {
    if (!selected) {
      return null
    }

    return list.find(({ address }) => address && getters.isEqualAddresses(address, selected))
  }, [ list, selected ])

  useEffect(() => {
    setSelected('')
  }, [ chainTokens ])

  const isSwapTokensFetching = isSwapTokenRatesFetching || isSwapTokenBalancesFetching

  return useMemo(() => ({
    list,
    isSwapTokensFetching,
    selected: selectedToken || depositToken,
    setSelected: setSelected,
  }), [
    list,
    depositToken,
    selectedToken,
    isSwapTokensFetching,
    setSelected,
  ])
}

useSwapTokens.mock = {
  list: [],
  selected: {
    units: 18,
    balance: 0n,
    name: 'Ether',
    address: ZeroAddress,
    title: constants.tokens.eth,
    emptyBalance: constants.blockchain.emptyBalance,
    logo: `token/${constants.tokens.eth}` as LogoName,
  },
  isSwapTokensFetching: false,
  setSelected: () => {},
} as ReturnType<typeof useSwapTokens>


export default useSwapTokens
