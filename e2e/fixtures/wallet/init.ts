import { Wallet } from 'ethers'

import { defaultChainId } from './chains'
import type { SupportedNetwork } from './chains'
import { initProvider } from './helpers'


type Input = {
  privateKey?: string
  address?: string
  chainId?: SupportedNetwork
}

export type Init = (input?: Input) => Promise<void>

type State = {
  address: string | null
  chainId: SupportedNetwork
}

type Wrapper = (deps: { page: E2E.ExtendedTest['page']; state: State }) => Init

export const createInit: Wrapper = ({ page, state }) => (
  async (input) => {
    const chainId = input?.chainId || defaultChainId

    const { address } = input?.address
      ? await initProvider({ page, address: input.address, chainId })
      : await initProvider({ page, privateKey: input?.privateKey || Wallet.createRandom().privateKey, chainId })

    state.address = address
    state.chainId = chainId
  }
)

export const createState = (): State => ({
  address: null,
  chainId: defaultChainId,
})

export type { State }
