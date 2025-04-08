import { Metadata } from 'next'
import type { StakeWiseSDK } from 'sdk'


declare global {
  const IS_PROD: boolean
  const IS_BEFORE_PROD: boolean
  const UNIQUE_FILE_ID: string

  type SDK = StakeWiseSDK
  type Library = StakeWise.Provider
  type ChainIds = 1 | 100 | 10200 | 560048
  type GenerateMetadata<T = {}> = (props: { params: T & { locale: Intl.LanguagesKeys }}) => Promise<Metadata>

  interface Window {
    e2e: any
    rabby: EthereumProvider
    taho: EthereumProvider
    okxwallet: EthereumProvider
    trustwallet: EthereumProvider
    braveEthereum: EthereumProvider
    ethereum?: EthereumProvider
    device: {
      isMobile: boolean
      isDesktop:boolean
    }
    navigator: Navigator
    onGemReady?: () => void
  }

  // Helpers
  type OneOfArray <T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer OneOfArray> ? OneOfArray : never

  declare module "*.svg" {
    const content: any
    export default content
  }

  declare module "*.webm" {
    const content: any
    export default content
  }

  declare module '*.jpg' {
    const content: any
    export default content
  }
  declare module '*.png' {
    const content: any
    export default content
  }
}
