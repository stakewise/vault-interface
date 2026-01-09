import { useCallback, useMemo, useRef, useState } from 'react'
import { useConfig } from 'config'
import { constants } from 'helpers'
import { ZeroAddress } from 'ethers'

import { LogoName } from 'components'

import useChangeEffect from '../controls/useChangeEffect'
import useTokensList from './useTokensList'


type Input = {
  list: ReturnType<typeof useTokensList>['list'],
  initialToken: string | null
}

const useToken = (values: Input) => {
  const { list, initialToken } = values

  const { chainId } = useConfig()
  const [ token, setToken ] = useState(initialToken || null)

  const chainIdRef = useRef(chainId)
  chainIdRef.current = chainId

  const initialTokenChainIdRef = useRef(chainId)

  useChangeEffect<[ string | null ]>(() => {
    setToken(initialToken as string)
    initialTokenChainIdRef.current = chainIdRef.current
  }, [ initialToken ])

  const tokenData = useMemo(() => {
    const selectedToken = initialTokenChainIdRef.current === chainIdRef.current ? token : initialToken

    return list.find(({ address }) => selectedToken === address) as SwapToken
  }, [ list, token, initialToken ])

  const resetToken = useCallback(() => {
    setToken(initialToken || null)
    initialTokenChainIdRef.current = chainIdRef.current
  }, [ initialToken ])

  return useMemo(() => ({
    data: tokenData,
    set: setToken,
    reset: resetToken,
  }), [
    tokenData,
    resetToken,
  ])
}

useToken.mock = {
  data: {
    units: 18,
    balance: 0n,
    name: 'Ether',
    address: ZeroAddress,
    title: constants.tokens.eth,
    emptyBalance: constants.blockchain.emptyBalance,
    logo: `token/${constants.tokens.eth}` as LogoName,
  },
  set: () => {},
  reset: () => {},
} as ReturnType<typeof useToken>


export default useToken
