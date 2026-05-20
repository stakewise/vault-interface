import React from 'react'
import cx from 'classnames'

import TransactionView from './TransactionView/TransactionView'
import { ModifiedTransaction, TransactionStatus, useLogic, useAction } from './util'

import s from './Transactions.module.scss'


export type TransactionsProps = {
  className?: string
  items: ModifiedTransaction[]
}

const View: React.FC<TransactionsProps> = (props) => {
  const { className, items } = props

  return (
    <div className={className}>
      {
        items.map(({ title, status, testId, onCancel }, index) => (
          <TransactionView
            key={index}
            className={cx({
              'mt-32': index,
              [s.line]: index < items.length - 1,
            })}
            status={status}
            title={title}
            onCancel={onCancel}
            dataTestId={testId}
          />
        ))
      }
    </div>
  )
}

const Transactions = {
  View: React.memo(View),
  Status: TransactionStatus,
  useLogic,
  useAction,
}


export default Transactions
