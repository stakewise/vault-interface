import { Wallet } from 'ethers'

import { defaultChainId } from './chains'
import { initProvider } from './helpers'

import type { SupportedNetwork } from './chains'


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
    const params = {
      page,
      chainId: input?.chainId || defaultChainId,
      address: input?.address,
      privateKey: input?.privateKey,
    }

    if (!params.address && !params.privateKey) {
      params.privateKey = Wallet.createRandom().privateKey
    }

    const { address } = await initProvider(params)

    state.address = address
    state.chainId = params.chainId
  }
)

export const createState = (): State => ({
  address: null,
  chainId: defaultChainId,
})

export type { State }
