import type { Page } from '@playwright/test'

import { chains } from './chains'
import type { SupportedNetwork } from './chains'
import type { State } from './init'


export type SwitchChain = (chainId: SupportedNetwork) => Promise<void>

type Wrapper = (deps: { page: Page; state: State }) => SwitchChain

export const createSwitchChain: Wrapper = ({ page, state }) => (
  async (chainId) => {
    await page.evaluate(
      async (chainIdHex) => {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [ { chainId: chainIdHex } ],
        })
      },
      chains[chainId].hexadecimalChainId
    )

    state.chainId = chainId
  }
)
