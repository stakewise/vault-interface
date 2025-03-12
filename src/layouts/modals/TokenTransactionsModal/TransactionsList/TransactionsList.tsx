import React from 'react'
import device from 'sw-modules/device'
import cx from 'classnames'

import { Pagination } from 'components'

import Header from './Header/Header'
import Skeleton from './Skeleton/Skeleton'
import EmptyView from './EmptyView/EmptyView'
import TransactionItem from './TransactionItem/TransactionItem'

import { useTransactionsList } from './util'

import s from './TransactionsList.module.scss'


export type TransactionsListProps = {
  token: string
}

const TransactionsList: React.FC<TransactionsListProps> = (props) => {
  const { token } = props

  const { isMobile } = device.useData()

  const limit = isMobile ? 6 : 10

  const { page, total, transactions, isFetching, setPage } = useTransactionsList({
    token,
    limit,
  })

  const gridClassName = cx(s.grid, 'px-24')

  const isEmpty = !isFetching && !page && !transactions.length
  const lastPageItems = total.items - (total.pages - 1) * limit
  const skeletonItems = total.pages === page + 1 ? lastPageItems : limit

  if (isEmpty) {
    return (
      <div
        className="h-full flex flex-col flex-1 mt-16"
        data-testid="empty-message"
      >
        <EmptyView />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col flex-1 mt-16">
      <Header
        className={cx(gridClassName, {
          'opacity-0': !page && !total.pages && isFetching,
        })}
      />
      {
        isFetching ? (
          <Skeleton
            count={skeletonItems}
          />
        ) : (
          transactions.map(({ amount, hash, sender, recipient, timestamp }, index) => (
            <TransactionItem
              key={index}
              className={cx(gridClassName, {
                'bg-secondary/10': index % 2 !== 0,
              })}
              sender={sender}
              hash={hash}
              amount={amount}
              recipient={recipient}
              timestamp={timestamp}
              dataIndex={index}
              dataTestId={`transaction-item-${index}`}
            />
          ))
        )
      }
      {
        total.pages > 1 && (
          <Pagination
            className="flex-1"
            page={page + 1}
            total={total.pages}
            setPage={(page) => setPage(page - 1)}
          />
        )
      }
    </div>
  )
}


export default React.memo(TransactionsList)
