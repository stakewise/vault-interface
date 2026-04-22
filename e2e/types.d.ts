import type { BrowserContext, Page, TestFixture } from '@playwright/test'

import type {
  ApiFixture,
  SDKFixture,
  UserFixture,
  SwapFixture,
  QueueFixture,
  VaultFixture,
  WalletFixture,
  OsTokenFixture,
  ElementFixture,
  HelpersFixture,
  GraphqlFixture,
  SettingsFixture,
  TransactionsFixture,
} from './fixtures'


declare global {

  namespace E2E {

    interface ExtendedTest {
      page: Page
      api: ApiFixture
      sdk: SDKFixture
      user: UserFixture
      swap: SwapFixture
      queue: QueueFixture
      vault: VaultFixture
      wallet: WalletFixture
      osToken: OsTokenFixture
      context: BrowserContext
      element: ElementFixture
      helpers: HelpersFixture
      graphql: GraphqlFixture
      settings: SettingsFixture
      transactions: TransactionsFixture
    }

    type Fixture<
      Fixture = () => Promise<void>,
      AdditionalArgs = object,
    > = TestFixture<Fixture, ExtendedTest & AdditionalArgs>

    type FixtureMethod<T, K extends keyof ExtendedTest = never> = [K] extends [never]
      ? () => T
      : (values: Pick<ExtendedTest, K>) => T
  }

  interface Window {
    e2e: Record<string, unknown>
  }
}
