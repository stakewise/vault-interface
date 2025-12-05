import { parseEther, ZeroAddress } from 'ethers'


type Input = {
  isClaimable: boolean
}

type Output = {
  totalAssets: number
  exitedAssets: number
}

type Payload = Store['vault']['user']['unstakeQueue']['data']

export type SetUnstakeQueue = (values: Input) => Promise<Output>

type Wrapper = E2E.FixtureMethod<SetUnstakeQueue, 'page'>

export const createSetUnstakeQueue: Wrapper = ({ page }) => (
  async (values: Input) => {
    const { isClaimable } = values

    const totalAssets = '9.5'
    const exitedAssets = '1.5'

    const data: Payload = {
      duration: 0,
      total: parseEther(totalAssets),
      withdrawable: isClaimable ? parseEther(exitedAssets) : 0n,
      positions: [
        {
          timestamp: '1727256912',
          positionTicket: '156652794390067408267',
          exitQueueIndex: '0',
        },
      ],
      requests: [
        {
          isV2Position: true,
          exitQueueIndex: '0',
          receiver: ZeroAddress,
          timestamp: '1727256912',
          withdrawalTimestamp: '0',
          isClaimed: !isClaimable,
          isClaimable: Boolean(isClaimable),
          positionTicket: '156652794390067408267',
          totalAssets: parseEther(totalAssets),
          exitedAssets: parseEther(exitedAssets),
        },
      ],
    }

    await page.evaluate((payload: Payload) => {
      window.e2e = {
        ...window.e2e,
        ['user/setUnstakeQueue']: payload,
      }
    }, data)

    return {
      totalAssets: Number(totalAssets),
      exitedAssets: Number(exitedAssets),
    }
  }
)
