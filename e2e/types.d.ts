import type { BrowserContext, Page, TestFixture } from '@playwright/test'
import type { GUI } from '@guardianui/test/dist/models/GUI'

import type {
  ApiFixture,
  SDKFixture,
  UserFixture,
  SwapFixture,
  QueueFixture,
  VaultFixture,
  AnvilFixture,
  WalletFixture,
  OsTokenFixture,
  RewardsFixture,
  ElementFixture,
  HelpersFixture,
  GraphqlFixture,
  SettingsFixture,
  GuardianFixture,
  TransactionsFixture,
} from './fixtures'


declare global {

  namespace E2E {

    interface ExtendedTest {
      gui: GUI
      page: Page
      api: ApiFixture
      sdk: SDKFixture
      user: UserFixture
      swap: SwapFixture
      queue: QueueFixture
      vault: VaultFixture
      anvil: AnvilFixture
      wallet: WalletFixture
      osToken: OsTokenFixture
      rewards: RewardsFixture
      context: BrowserContext
      element: ElementFixture
      helpers: HelpersFixture
      graphql: GraphqlFixture
      settings: SettingsFixture
      guardian: GuardianFixture
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
    e2e: any
  }
}
