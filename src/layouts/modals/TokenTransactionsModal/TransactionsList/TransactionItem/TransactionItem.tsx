import React from 'react'
import cx from 'classnames'
import date from 'sw-modules/date'
import device from 'sw-modules/device'
import { commonMessages } from 'helpers'

import { Text, TokenAmount, Icon , Href } from 'components'


export type TransactionItemProps = {
  className?: string
  hash: {
    link: string
    text: string
  }
  amount: {
    token: string
    value: string
    isExpenses: boolean
  }
  sender: Intl.Message | string
  recipient: Intl.Message | string
  timestamp: number
  dataIndex?: number
  dataTestId?: string
}

const TransactionItem: React.FC<TransactionItemProps> = (props) => {
  const { className, hash, recipient, amount, sender, timestamp, dataIndex, dataTestId } = props

  const { isMobile } = device.useData()

  return (
    <div
      className={cx(className, 'py-16 grid items-center')}
      data-index={dataIndex}
      data-testid={dataTestId}
    >
      <div className="flex justify-start items-center">
        <Text
          color={amount.isExpenses ? 'error' : 'success-light'}
          message={amount.isExpenses ? '-' : '+'}
          size="t14m"
          dataTestId={`${dataTestId}-sign`}
        />
        <Text
          className="ml-8 whitespace-nowrap"
          color="dark"
          size="t14m"
          message={sender}
          dataTestId={`${dataTestId}-sender`}
        />
      </div>
      <Text
        className="text-right whitespace-nowrap"
        color="dark"
        size="t14m"
        message={recipient}
        dataTestId={`${dataTestId}-recipient`}
      />
      <div>
        <TokenAmount
          className="justify-end"
          value={amount.value}
          token={amount.token as 'SWISE'}
          size="sm"
          dataTestId={`${dataTestId}-amount`}
        />
      </div>
      <Text
        className={cx('whitespace-nowrap', {
          'opacity-60': isMobile,
        })}
        color="dark"
        size="t14m"
        message={date.time(timestamp).fromNow()}
        dataTestId={`${dataTestId}-timestamp`}
      />
      <Text
        color="dark"
        size="t14m"
        message={hash.text}
      />
      <Href
        to={hash.link}
        dataTestId={`${dataTestId}-hash`}
        ariaLabel={commonMessages.accessibility.viewInBlockExplorer}
      >
        <Icon
          name="icon/link"
          color="primary"
          size={16}
        />
      </Href>
    </div>
  )
}


export default React.memo(TransactionItem)
