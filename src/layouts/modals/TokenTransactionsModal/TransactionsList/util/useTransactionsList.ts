import { useMemo, useState, useCallback, useEffect } from 'react'
import { useConfig } from 'config'

import useTokenTransactions from './useTokenTransactions'
import useTransactionsCount from './useTransactionsCount'


type Output = {
  page: number
  total: {
    items: number
    pages: number
  }
  transactions: TokenTransactionsModal.Transaction[]
  isFetching: boolean
  setPage: (page: number) => void
}

type Input = {
  token: string
  limit: number
}

const useTransactionsList = ({ limit, token }: Input): Output => {
  const { address } = useConfig()

  const [ page, setPage ] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [ token, limit ])

  const { transactionsCount, isFetching: isTransactionsCountFetching } = useTransactionsCount()

  const isEmpty = !isTransactionsCountFetching && !transactionsCount

  const { transactions, isFetching: isTransactionsFetching } = useTokenTransactions({
    skip: page * limit,
    first: limit,
    token,
    pause: !token || !address || isEmpty,
  })

  const handleSetPage = useCallback((page: number) => {
    const pages = Math.ceil(transactionsCount / limit)

    if (pages && page >= 0 && page <= pages) {
      setPage(page)
    }
  }, [ transactionsCount, limit ])

  const isFetching = isTransactionsCountFetching || isTransactionsFetching

  return useMemo(() => ({
    page,
    total: {
      items: transactionsCount,
      pages: Math.ceil(transactionsCount / limit),
    },
    transactions,
    isFetching,
    setPage: handleSetPage,
  }), [ page, limit, transactions, transactionsCount, isFetching, handleSetPage ])
}


export default useTransactionsList
