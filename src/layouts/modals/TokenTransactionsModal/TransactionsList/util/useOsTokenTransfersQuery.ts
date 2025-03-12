import { useCallback, useEffect, useState } from 'react'
import methods from 'sw-methods'
import { useConfig } from 'config'


type Input = {
  variables: {
    where: Record<string, any>
    skip: number
    first: number
    orderDirection: string
  }
  pause?: boolean
}

type TokenTransfersQueryPayload = {
  tokenTransfers: {
    id: string
    to: string
    from: string
    amount: string
    timestamp: string
  }[]
}

type State = {
  data: TokenTransfersQueryPayload | null
  isFetching: boolean
}

const useOsTokenTransfersQuery = ({ variables, pause }: Input) => {
  const { sdk } = useConfig()

  const [ { data, isFetching }, setState ] = useState<State>({
    data: null,
    isFetching: !pause,
  })

  const fetchTokenTransfers = useCallback(async () => {
    setState({ data: null, isFetching: true })

    try {
      const data = await methods.fetch<TokenTransfersQueryPayload>(sdk.config.api.subgraph, {
        method: 'POST',
        body: JSON.stringify({
          query: `
            query TokenTransfers($where: TokenTransfer_filter, $skip: Int, $first: Int, $orderDirection: OrderDirection) {
              tokenTransfers(where: $where, skip: $skip, first: $first, orderBy: timestamp, orderDirection: $orderDirection) {
                id
                to
                from
                amount
                timestamp
              }
            }
          `,
          variables,
        }),
      })

      setState({ data, isFetching: false })
    }
    catch {
      setState({ data: null, isFetching: false })
    }
  }, [ sdk, variables ])

  useEffect(() => {
    fetchTokenTransfers()
  }, [ fetchTokenTransfers ])

  return {
    data: data?.tokenTransfers || [],
    isFetching,
  }
}


export default useOsTokenTransfersQuery
