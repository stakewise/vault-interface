import React from 'react'
import cx from 'classnames'
import modal from 'sw-modules/modal'
import device from 'sw-modules/device'
import { commonMessages } from 'helpers'

import { Tabs, Modal } from 'components'

import TransactionsList from './TransactionsList/TransactionsList'
import { useTabs, useResetCache } from './util'

import s from './TokenTransactionsModal.module.scss'


export const [ TokenTransactionsModal, openTokenTransactionsModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props) => {
    const { closeModal } = props

    const { isMobile } = device.useData()
    const { tabsList, tabField } = useTabs({ closeModal })

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
        <Tabs
          className={cx(s.tabs, 'flex flex-col h-full flex-1')}
          panelClassName="flex flex-col flex-1"
          panelsClassName="flex flex-col flex-1"
          field={tabField}
          tabsList={tabsList}
        >
          {
            ({ id }) =>  (
              <TransactionsList token={id} />
            )
          }
        </Tabs>
      </Modal>
    )
  })
)
