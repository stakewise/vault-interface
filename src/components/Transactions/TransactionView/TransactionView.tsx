import React, { useMemo } from 'react'
import cx from 'classnames'

import Icon from '../../Icon/Icon'
import Text from '../../Text/Text'
import ButtonBase from '../../ButtonBase/ButtonBase'
import { ModifiedTransaction, TransactionStatus } from '../util'

import messages from './messages'


export type StepProps = Omit<ModifiedTransaction, 'id' | 'testId'> & {
  className?: string
  dataTestId?: string
}

const descriptions = {
  [TransactionStatus.Fail]: messages.fail,
  [TransactionStatus.Cancel]: messages.cancel,
  [TransactionStatus.Waiting]: messages.waiting,
  [TransactionStatus.Success]: messages.success,
  [TransactionStatus.Confirm]: messages.confirmTransaction,
  [TransactionStatus.Canceling]: messages.canceling,
  [TransactionStatus.Processing]: messages.processing,
}

const loaderStatuses: TransactionStatus[] = [
  TransactionStatus.Confirm,
  TransactionStatus.Canceling,
  TransactionStatus.Processing,
]

const closeStatuses: TransactionStatus[] = [
  TransactionStatus.Fail,
  TransactionStatus.Cancel,
]

const lastStatuses: TransactionStatus[] = [
  TransactionStatus.Fail,
  TransactionStatus.Success,
]

const TransactionView: React.FC<StepProps> = (props) => {
  const { className, status, title, dataTestId, onCancel } = props

  const isLoader = loaderStatuses.includes(status)
  const isClose = closeStatuses.includes(status)
  const isLast = lastStatuses.includes(status)

  const iconClassName = cx('mt-8 flex items-center justify-center flex-none rounded-full w-32 h-32', {
    'bg-dark/5': !isLast,
    'bg-success-light': status === TransactionStatus.Success,
    'bg-error': status === TransactionStatus.Fail,
  })

  const iconName = useMemo(() => {
    if (status === TransactionStatus.Success) {
      return 'icon/check'
    }
    if (isClose) {
      return 'icon/close'
    }
    if (isLoader) {
      return 'icon/loader'
    }

    return null
  }, [ status, isClose, isLoader ])

  return (
    <div
      className={cx(className, 'flex items-start', {
        'opacity-40': status === TransactionStatus.Waiting,
      })}
      data-testid={dataTestId}
    >
      <div className={iconClassName}>
        {
          iconName && (
            <Icon
              className={cx('flex-none', {
                'rotate-360': isLoader,
              })}
              name={iconName}
              color={isLast ? 'white' : 'dark'}
              size={24}
            />
          )
        }
      </div>
      <div className="flex-1 ml-12">
        <div className="mt-4 flex items-center gap-8">
          <Text
            message={title}
            color="dark"
            size="t14m"
            dataTestId={dataTestId ? `${dataTestId}-title` : undefined}
          />
          {
            typeof onCancel === 'function' && status === TransactionStatus.Processing && (
              <>
                <div className="w-4 h-4 bg-dark rounded-full" />
                <ButtonBase
                  className="interaction-color-error"
                  onClick={onCancel}
                  dataTestId={dataTestId ? `${dataTestId}-cancel` : undefined}
                >
                  <Text
                    message={messages.buttonTitle.cancel}
                    color="inherit"
                    size="t14m"
                  />
                </ButtonBase>
              </>
            )
          }
        </div>
        <Text
          className="mt-4 opacity-60"
          message={descriptions[status] as Intl.Message}
          color="dark"
          size="t14"
        />
      </div>
    </div>
  )
}


export default React.memo(TransactionView)
