import { useEffect, useMemo, useState } from 'react'
import { useConfig } from 'config'
import { swapTokens, swapTokenTitles, constants } from 'helpers'
import useStore from '../data/useStore'

import { LogoName } from 'components'


const storeSelector = (store: Store) => ({
  swapTokenRates: store.swapTokenRates.data,
  swapTokenBalances: store.account.swapTokenBalances.data,
  depositTokenBalance: store.account.balances.data.depositTokenBalance,
})

type Output = {
  list: SwapToken[]
  selected: SwapToken
  setSelected: (address: string | null) => void
}

interface Hook {
  (): Output
  mock: Output
}

const useSwapTokens: Hook = () => {
  const { sdk, chainId, isMainnet } = useConfig()
  const [ selected, setSelected ] = useState<string>('')
  const { swapTokenRates, swapTokenBalances, depositTokenBalance } = useStore(storeSelector)

  const chainTokens = swapTokens[chainId as keyof typeof swapTokens]

  useEffect(() => {
    setSelected('')
  }, [ chainTokens ])

  const depositToken = useMemo(() => ({
    title: isMainnet ? 'Ether' : 'Gnosis',
    name: sdk.config.tokens.depositToken as string,
    address: '',
    logo: `token/${sdk.config.tokens.depositToken}` as LogoName,
    balance: depositTokenBalance,
    units: 18,
    emptyBalance: constants.blockchain.emptyBalance,
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

  const selectedToken = useMemo(() => (
    list.find(({ address }) => address === selected) || depositToken
  ), [ list, selected, depositToken ])

  return useMemo(() => ({
    list,
    selected: selectedToken,
    setSelected: setSelected as Output['setSelected'],
  }), [
    list,
    selectedToken,
    setSelected,
  ])
}

useSwapTokens.mock = {
  list: [],
  selected: {
    name: 'Ether',
    title: constants.tokens.eth,
    address: '',
    logo: `token/${constants.tokens.eth}` as LogoName,
    balance: 0n,
    units: 18,
    emptyBalance: constants.blockchain.emptyBalance,
  },
  setSelected: () => {},
}


export default useSwapTokens
