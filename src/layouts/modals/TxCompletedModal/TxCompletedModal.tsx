import React from 'react'
import cx from 'classnames'
import modal from 'sw-modules/modal'
import device from 'sw-modules/device'
import { useConfig } from 'config'
import useModalClose from 'hooks/controls/useModalClose'

import { Button, Modal } from 'components'

import Token, { TokenProps } from './Token/Token'
import TransactionButton from './TransactionButton/TransactionButton'
import AddMintTokenButton from './AddMintTokenButton/AddMintTokenButton'
import FailedToken, { FailedTokenProps } from './FailedToken/FailedToken'

import { Action } from './enum'
import messages from './messages'


export type TokenData = Omit<TokenProps, 'className'> & {
  apy?: number
  hash?: string
  onTryAgainClick?: () => void
}

export type FailData = Omit<FailedTokenProps, 'className'> & {
  onTryAgainClick: () => void
}

type Input = {
  tokens: TokenData[]
  fails?: FailData[]
  hash?: string
}

type ModalProps = Modals.VisibilityProps & Input

export { Action }

export const [ TxCompletedModal, openTxCompletedModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props: ModalProps) => {
    const { tokens, fails, hash, closeModal } = props

    const { isMobile } = device.useData()
    const { isInjectedWallet } = useConfig()

    useModalClose({ closeModal })

    const withAddMintToken = tokens.some((item) => item.action === Action.Mint)

    return (
      <Modal
        title={messages.title}
        size="narrow"
        dataTestId="transaction-modal"
        contentClassName="flex flex-col"
        closeModal={closeModal}
      >
        {
          tokens.map(({ token, value, action, hash }, index) => (
            <div
              key={index}
            >
              <Token
                token={token}
                value={value}
                action={action}
              />
              {
                hash && (
                  <TransactionButton
                    className="mb-16"
                    hash={hash}
                  />
                )
              }
            </div>
          ))
        }
        {
          fails?.map(({ token, value, action, onTryAgainClick }, index) => (
            <div
              key={index}
            >
              <FailedToken
                token={token}
                value={value}
                action={action}
              />
              <Button
                className="mb-16"
                title={messages.tryAgain}
                color="primary"
                fullWidth
                onClick={() => {
                  if (typeof onTryAgainClick === 'function') {
                    onTryAgainClick()
                  }

                  closeModal()
                }}
              />
            </div>
          ))
        }
        <div
          className={cx('hide-empty flex gap-16 mt-8', {
            'flex-col': isMobile,
          })}
        >
          {
            hash && (
              <TransactionButton
                className="flex-1"
                hash={hash}
              />
            )
          }
          {
            withAddMintToken && isInjectedWallet && (
              <AddMintTokenButton
                className="flex-1"
              />
            )
          }
        </div>
      </Modal>
    )
  })
)
