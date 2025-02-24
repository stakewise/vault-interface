import React, { useMemo } from 'react'
import cx from 'classnames'

import Icon from '../../Icon/Icon'
import Text from '../../Text/Text'
import { TransactionStatus } from '../util'

import messages from './messages'


export type StepProps = {
  className?: string
  title: Intl.Message
  status: TransactionStatus
  dataTestId?: string
}

const descriptions = {
  [TransactionStatus.Fail]: messages.fail,
  [TransactionStatus.Waiting]: messages.waiting,
  [TransactionStatus.Pending]: messages.waiting,
  [TransactionStatus.Success]: messages.success,
  [TransactionStatus.Confirm]: messages.confirmTransaction,
}

const TransactionView: React.FC<StepProps> = (props) => {
  const { className, status, title, dataTestId } = props

  const isLoaderVisible = [ TransactionStatus.Waiting, TransactionStatus.Confirm ].includes(status)

  const iconClassName = cx('flex items-center justify-center flex-none rounded-full w-32 h-32', {
    'bg-moon/05': status === TransactionStatus.Pending || isLoaderVisible,
    'bg-forest': status === TransactionStatus.Success,
    'bg-volcano': status === TransactionStatus.Fail,
  })

  const iconName = useMemo(() => {
    if (status === TransactionStatus.Success) {
      return 'icon/check'
    }
    if (status === TransactionStatus.Fail) {
      return 'icon/close'
    }
    if (isLoaderVisible) {
      return 'icon/loader'
    }

    return null
  }, [ status, isLoaderVisible ])

  return (
    <div
      className={cx(className, 'flex items-center', {
        'opacity-40': status === TransactionStatus.Pending,
      })}
      data-testid={dataTestId}
    >
      <div className={iconClassName}>
        {
          iconName && (
            <Icon
              className={cx('flex-none', {
                'rotate-360': isLoaderVisible,
              })}
              name={iconName}
              color={isLoaderVisible ? 'moon' : 'snow'}
              size={24}
            />
          )
        }
      </div>
      <div className="flex-1 ml-12">
        <Text
          className="flex-1"
          message={title}
          color="moon"
          size="t14m"
          dataTestId={dataTestId ? `${dataTestId}-title` : undefined}
        />
        <Text
          className="mt-4 opacity-60"
          message={descriptions[status] as Intl.Message}
          color="moon"
          size="t14"
        />
      </div>
    </div>
  )
}


export default React.memo(TransactionView)
