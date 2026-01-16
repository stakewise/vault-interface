import React from 'react'

import Transactions from '../Transactions/Transactions'
import { ModifiedTransaction } from '../Transactions/util'
import Modal, { ModalProps } from '../Modal/Modal'


export type TransactionsModalProps = Omit<ModalProps, 'ref'> & {
  title: Intl.Message | string
  items: ModifiedTransaction[]
}

const TransactionsModal: React.FC<TransactionsModalProps> = ({ title, items, ...rest }) => (
  <Modal
    title={title}
    size="narrow"
    dataTestId="transaction-modal"
    contentClassName="flex flex-col"
    {...rest}
  >
    <Transactions.View
      className="mx-auto w-[290px]"
      items={items}
    />
  </Modal>
)


export default React.memo(TransactionsModal)
