import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConfig } from 'config'
import methods from 'sw-methods'


type TokenHoldersQueryPayload = {
  osTokenHolders: {
    id: string
    transfersCount: number
  }[]
}

type Output = {
  transactionsCount: number
  isFetching: boolean
}

const useTransactionsCount = (): Output => {
  const { sdk, address } = useConfig()

  const [ { data, isFetching }, setState ] = useState({
    data: null,
    isFetching: !address,
  })

  const fetchOsTokenHolders = useCallback(async () => {
    setState({ data: null, isFetching: true })

    try {
      const data = await methods.fetch<TokenHoldersQueryPayload>(sdk.config.api.subgraph, {
        method: 'POST',
        body: JSON.stringify({
          query: `
            query TokenHolders($address: ID!) {
              osTokenHolders(where: { id: $address }) {
                id
                transfersCount
              }
            }
          `,
          variables: {
            address,
          },
        }),
      })

      setState({ data, isFetching: false })
    }
    catch {
      setState({ data: null, isFetching: false })
    }
  }, [ sdk, address ])

  useEffect(() => {
    fetchOsTokenHolders()
  }, [ fetchOsTokenHolders ])

  return useMemo(() => ({
    transactionsCount: data?.osTokenHolders[0]?.transfersCount || 0,
    isFetching,
  }), [ data, isFetching ])
}


export default useTransactionsCount
