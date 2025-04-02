import React from 'react'
import modal from 'modules/modal'
import { useModalClose } from 'hooks'
import { commonMessages } from 'helpers'

import { Modal } from 'components'

import RewardsChart from './RewardsChart/RewardsChart'


export const [ StatisticsModal, openStatisticsModal ] = (
  modal.wrapper(UNIQUE_FILE_ID, (props: Modals.VisibilityProps) => {
    const { closeModal } = props

    useModalClose({ closeModal })

    return (
      <Modal
        title={commonMessages.statistics}
        size="wide"
        dataTestId="transaction-modal"
        contentClassName="flex flex-col"
        closeModal={closeModal}
      >
        <RewardsChart closeModal={closeModal} />
      </Modal>
    )
  })
)
