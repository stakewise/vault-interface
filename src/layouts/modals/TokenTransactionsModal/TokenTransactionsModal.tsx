import React from 'react'
import cx from 'classnames'
import modal from 'sw-modules/modal'
import device from 'sw-modules/device'
import { commonMessages, constants } from 'helpers'

import { Modal } from 'components'

import TransactionsList from './TransactionsList/TransactionsList'
import { useResetCache } from './util'

import s from './TokenTransactionsModal.module.scss'


export const [ TokenTransactionsModal, openTokenTransactionsModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props) => {
    const { closeModal } = props

    const { isMobile } = device.useData()

    useResetCache()

    return (
      <Modal
        className={cx(s.modal, 'flex flex-col', {
          'overflow-x-hidden': isMobile,
          'h-full': !isMobile,
        })}
        title={commonMessages.transactions}
        closeModal={closeModal}
        contentClassName={cx({
          [s.content]: isMobile,
          'overflow-x-auto flex flex-col': isMobile,
        })}
      >
        <TransactionsList token={constants.tokens.osToken} />
      </Modal>
    )
  })
)
