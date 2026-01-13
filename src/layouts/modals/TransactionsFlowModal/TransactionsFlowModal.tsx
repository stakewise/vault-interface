import React, { useCallback, useEffect } from 'react'
import modal from 'modules/modal'
import { commonMessages } from 'helpers'
import useModalClose from 'hooks/controls/useModalClose'

import TransactionsModal from '../../../components/TransactionsModal/TransactionsModal'
import type { SetTransaction } from '../../../components/Transactions/types'
import { TransactionStatus } from '../../../components/Transactions/util'


import { useTransactionsFlow } from './util'
import type { TransactionsFlow, StepsData } from './types'


type OnStartInput = {
  setTransaction: SetTransaction
}

type Input = Modals.VisibilityProps & {
  flow: TransactionsFlow
  stepsData?: StepsData
  onStart: (values: OnStartInput) => Promise<void>
}

export const [ TransactionsFlowModal, openTransactionsFlowModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props: Input) => {
    const { flow, stepsData, onStart, closeModal } = props

    const { transactions, setTransaction } = useTransactionsFlow({
      flow,
      stepsData,
    })

    useModalClose({ closeModal })

    const handleStart = useCallback(async () => {
      await onStart({ setTransaction })

      closeModal()
    }, [ onStart, closeModal, setTransaction ])

    useEffect(() => {
      handleStart()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const completedStatuses = [ TransactionStatus.Fail, TransactionStatus.Success, TransactionStatus.Cancel ]
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
