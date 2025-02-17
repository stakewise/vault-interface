import { Metadata } from 'next'
import type { StakeWiseSDK } from 'apps/v3-sdk'


declare global {
  const IS_PROD: boolean
  const IS_BEFORE_PROD: boolean
  const UNIQUE_FILE_ID: string

  type SDK = StakeWiseSDK
  type Library = StakeWise.Provider
  type ChainIds = 1 | 100 | 17000 | 10200
  type GenerateMetadata<T = {}> = (props: { params: T & { locale: Intl.LanguagesKeys }}) => Promise<Metadata>

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
