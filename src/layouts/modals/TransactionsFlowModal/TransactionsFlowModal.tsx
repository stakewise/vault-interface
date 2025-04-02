import React, { useCallback, useEffect } from 'react'
import { useModalClose } from 'hooks'
import modal from 'modules/modal'
import { commonMessages } from 'helpers'

import { SetTransaction, TransactionsModal, TransactionStatus } from 'components'

import { useTransactionsFlow } from './util'
import type { TransactionsFlow } from './types'


type OnStartInput = {
  setTransaction: SetTransaction
}

type Input = Modals.VisibilityProps & {
  flow: TransactionsFlow
  availableSteps?: string[]
  onStart: (values: OnStartInput) => Promise<void>
}

export const [ TransactionsFlowModal, openTransactionsFlowModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props: Input) => {
    const { flow, availableSteps, onStart, closeModal } = props

    const { transactions, setTransaction } = useTransactionsFlow({
      flow,
      availableSteps,
    })

    useModalClose({ closeModal })

    const handleStart = useCallback(async () => {
      await onStart({ setTransaction })

      closeModal()
    }, [ onStart, closeModal, setTransaction ])

    useEffect(() => {
      handleStart()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const completedStatuses = [ TransactionStatus.Fail, TransactionStatus.Success ]
    const isOverlayDisabled = !transactions.every(({ status }) => completedStatuses.includes(status))

    return (
      <TransactionsModal
        title={commonMessages.transaction.sending}
        items={transactions}
        isOverlayDisabled={isOverlayDisabled}
        isCloseButtonDisabled={isOverlayDisabled}
        dataTestId="transactions-flow-modal"
        closeModal={closeModal}
      />
    )
  })
)
