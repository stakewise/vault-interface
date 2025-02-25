import { useCallback, useMemo } from 'react'
import { formatEther, ZeroAddress } from 'ethers'
import device from 'sw-modules/device'
import { useConfig } from 'config'
import { getters } from 'helpers'
import methods from 'sw-methods'

// import {
//   useTokenTransfersQuery,
//   TokenTransfersQueryPayload,
// } from 'graphql/subgraph/tokenTransfers'

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

const modifyTokenTransfers = ({ tokenTransfers }: TokenTransfersQueryPayload) => tokenTransfers

const useTokenTransactions = ({ skip, first, token, pause }: Input): Output => {
  const { isMobile } = device.useData()
  const { sdk, address } = useConfig()

  const where = useMemo(() => {
    const formattedAddress = address?.toLowerCase() as string

    return {
      or: [
        { tokenSymbol: token, from: formattedAddress },
        { tokenSymbol: token, to: formattedAddress },
      ],
    }
  }, [ token, address ])

  // const { data: tokenTransfers, isFetching: isTokenTransfersFetching } = useTokenTransfersQuery({
  //   urls: sdk.config.api,
  //   variables: {
  //     skip,
  //     first,
  //     where,
  //     orderDirection: 'desc',
  //   },
  //   pause,
  //   modifyResult: modifyTokenTransfers,
  // })

  const tokenTransfers = []
  const isTokenTransfersFetching = false

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
      const tokenName = token === 'osToken' ? sdk.config.tokens.mintToken : token

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
  }, [ sdk, token, address, tokenTransfers, getAddressMessage ])

  return useMemo(() => ({
    transactions,
    isFetching: isTokenTransfersFetching,
  }), [ transactions, isTokenTransfersFetching ])
}


export default useTokenTransactions
