import { createCheckTransaction, CheckTransaction } from './checkTransaction'
import { createCheckTxCompletedModal, CheckTxCompletedModal } from './checkTxCompletedModal'


export type TransactionsFixture = {
  checkTransaction: CheckTransaction
  checkTxCompletedModal: CheckTxCompletedModal
}

const transactions: E2E.Fixture<TransactionsFixture> = async ({ element, page, helpers, graphql }, use) => {
  await use({
    checkTransaction: createCheckTransaction({ helpers, element, graphql }),
    checkTxCompletedModal: createCheckTxCompletedModal({ page }),
  })
}


export default transactions
