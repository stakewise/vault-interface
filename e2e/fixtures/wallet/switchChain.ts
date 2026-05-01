import type { Page } from '@playwright/test'

import { chains } from './chains'
import type { State } from './init'
import type { SupportedNetwork } from './chains'


type EthereumProvider = {
  request: (args: { method: string, params: unknown[] }) => Promise<unknown>
}

export type SwitchChain = (chainId: SupportedNetwork) => Promise<void>

type Wrapper = (deps: { page: Page; state: State }) => SwitchChain

export const createSwitchChain: Wrapper = ({ page, state }) => (
  async (chainId) => {
    await page.evaluate(
      async (chainIdHex) => {
        const { ethereum } = window as unknown as { ethereum: EthereumProvider }

        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [ { chainId: chainIdHex } ],
        })
      },
      chains[chainId].hexadecimalChainId
    )

    state.chainId = chainId
  }
)
