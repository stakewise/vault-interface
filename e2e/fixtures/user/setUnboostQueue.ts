import { parseEther } from 'ethers'


const waitingDurationSeconds = 604800

type Input = {
  exitingShares: string
  exitingRewards: string
  isClaimable: boolean
}

export type SetUnboostQueue = (values: Input) => Promise<void>

type Payload = Store['vault']['user']['unboostQueue']['data']

type Wrapper = E2E.FixtureMethod<SetUnboostQueue, 'page'>

export const createSetUnboostQueue: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { exitingShares, exitingRewards, isClaimable } = values

    const data: Payload = {
      version: 1,
      isClaimable: Boolean(isClaimable),
      exitingShares: parseEther(exitingShares),
      exitingAssets: parseEther(exitingRewards),
      duration: isClaimable ? 0 : waitingDurationSeconds,
      position: isClaimable ? {
        timestamp: '1730206212',
        positionTicket: '210258902756807306422',
        exitQueueIndex: '1',
      } : null,
    }

    await page.evaluate(async (payload: Payload) => {
      window.e2e = {
        ...window.e2e,
        ['user/setUnboostQueue']: payload,
      }
    }, data)
  }
)
