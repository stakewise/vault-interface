import { parseEther } from 'ethers'

import { mockCustomDataOnce } from './helpers'


type Wrapper = E2E.FixtureMethod<MockAllocatorsData, 'page'>

export type MockAllocatorsData = (amount: string) => Promise<void>

export const createMockAllocatorsData: Wrapper = ({ page }) => (
  async (amount: string) => {
    const assets = Number(amount) ? parseEther(amount).toString() : ''

    await mockCustomDataOnce<any>({
      page,
      name: 'Allocators',
      data: {
        allocators: assets ? [ { assets } ] : [],
      },
    })
  }
)
