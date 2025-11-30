import { expect } from '@playwright/test'


type Wrapper = E2E.FixtureMethod<CheckTxCompletedModal, 'page'>

type Action = 'burn'
  | 'mint'
  | 'stake'
  | 'boost'
  | 'unstake'
  | 'exiting'
  | 'received'
  | 'redeemed'
  | 'exitQueue'
  | 'claimReward'
  | 'exitingReward'

export type TransactionItem = {
  action: Action
  value?: string
  more?: string
  less?: string
  startsWith?: string
}

export type CheckTxCompletedModal = (...transactionItems: TransactionItem[]) => Promise<void>

const texts = {
  burn: 'osETH burned',
  mint: 'osETH minted',
  stake: 'ETH staked',
  boost: 'osETH boosted',
  exiting: 'Exiting osETH',
  received: 'ETH received',
  redeemed: 'ETH redeemed',
  unstake: 'osETH unstaked',
  claimReward: 'ETH unstaked',
  exitingReward: 'Exiting ETH',
  exitQueue: 'Added to unstake queue',
}

export const createCheckTxCompletedModal: Wrapper = ({ page }) => (
  async (...transactionItems) => {

    await page.waitForSelector('[data-testid="transaction-modal"]')

    const items = transactionItems.filter(Boolean) as TransactionItem[]

    for (const item of items) {
      const { action, value, more, less, startsWith } = item

      const [ text, amount ] = await Promise.all([
        page.getByTestId(`action-${action}`).textContent(),
        page.getByTestId(`action-${action}-value`).textContent(),
      ])

      expect(text).toEqual(texts[action])

      const amountNumber = Number(amount)

      if (value) {
        expect(amountNumber).toEqual(Number(value))
      }

      if (more) {
        expect(amountNumber).toBeGreaterThan(Number(more))
      }

      if (less) {
        expect(amountNumber).toBeLessThan(Number(less))
      }

      if (startsWith) {
        expect(startsWith.startsWith(amount || '')).toBeTruthy()
      }
    }

    await page.getByTestId('transaction-modal-close').click()
  }
)
