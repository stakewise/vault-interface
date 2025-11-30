import { createCheckTransaction, CheckTransaction } from './checkTransaction'
import { createCheckTxCompletedModal, CheckTxCompletedModal } from './checkTxCompletedModal'
import { createCheckTransactionsFlow, CheckTransactionsFlow } from './checkTransactionsFlow'


export type TransactionsFixture = {
  checkTransaction: CheckTransaction
  checkTxCompletedModal: CheckTxCompletedModal
  checkTransactionsFlow: CheckTransactionsFlow
}

const transactions: E2E.Fixture<TransactionsFixture> = async ({ element, page, helpers, graphql }, use) => {
  await use({
    checkTransaction: createCheckTransaction({ helpers, element, graphql }),
    checkTransactionsFlow: createCheckTransactionsFlow({ page, helpers }),
    checkTxCompletedModal: createCheckTxCompletedModal({ page }),
  })
}


export default transactions
