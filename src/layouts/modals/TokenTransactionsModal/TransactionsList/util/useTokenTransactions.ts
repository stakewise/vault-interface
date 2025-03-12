import { useCallback, useMemo } from 'react'
import { formatEther, ZeroAddress } from 'ethers'
import device from 'sw-modules/device'
import { useConfig } from 'config'
import { getters } from 'helpers'
import methods from 'sw-methods'

import useOsTokenTransfersQuery from './useOsTokenTransfersQuery'

import messages from './messages'


type Output = {
  transactions: TokenTransactionsModal.Transaction[]
  isFetching: boolean
}

type Input = {
  skip: number
  first: number
  token: string
  pause: boolean
}

const useTokenTransactions = ({ skip, first, token, pause }: Input): Output => {
  const { isMobile } = device.useData()
  const { sdk, address } = useConfig()

  const variables = useMemo(() => {
    const formattedAddress = address?.toLowerCase() as string

    const where = {
      or: [
        { tokenSymbol: token, from: formattedAddress },
        { tokenSymbol: token, to: formattedAddress },
      ],
    }

    return {
      skip,
      first,
      where,
      orderDirection: 'desc',
    }
  }, [ skip, first, token, address ])

  const { data: tokenTransfers, isFetching: isTokenTransfersFetching } = useOsTokenTransfersQuery({
    variables,
    pause,
  })

  const getAddressMessage = useCallback((sender: string) => {
    const isUserAddress = getters.isEqualAddresses(address as string, sender)
    const isSenderContract = getters.isEqualAddresses(sender, ZeroAddress)

    if (isSenderContract) {
      return {
        ...messages.contract,
        values: {
          token: isMobile ? '' : token,
        },
      }
    }

    return isUserAddress ? messages.you : methods.shortenAddress(sender, -4)
  }, [ token, address, isMobile ])

  const transactions = useMemo(() => {
    if (tokenTransfers?.length && address) {
      const tokenName = sdk.config.tokens.mintToken

      return tokenTransfers.map(({ id, to, from, amount, timestamp }) => ({
        amount: {
          token: tokenName as Extract<Tokens, 'SWISE' | 'osETH' | 'osGNO'>,
          value: formatEther(amount),
          isExpenses: getters.isEqualAddresses(from, address),
        },
        hash: {
          text: methods.shortenAddress(id, -4),
          link: `${sdk.config.network.blockExplorerUrl}/tx/${id}`,
        },
        timestamp: Number(timestamp) * 1000,
        sender: getAddressMessage(from),
        recipient: getAddressMessage(to),
      }))
    }

    return []
  }, [ sdk, address, tokenTransfers, getAddressMessage ])

  return useMemo(() => ({
    transactions,
    isFetching: isTokenTransfersFetching,
  }), [ transactions, isTokenTransfersFetching ])
}


export default useTokenTransactions
