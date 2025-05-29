import * as constants from '../../constants'


type Wrapper = E2E.FixtureMethod<checkWalletList, 'page' | 'element'>

export type checkWalletList = (isMobile?: boolean, withWalletConnect?: boolean) => Promise<void>

const walletList = [
  {
    id: constants.walletNames.metaMask,
    title: constants.walletTitles.metaMask,
  },
  {
    id: constants.walletNames.walletConnect,
    title: constants.walletTitles.walletConnect,
  },
  {
    id: constants.walletNames.ledger,
    title: constants.walletTitles.ledger,
  },
  {
    id: constants.walletNames.coinbase,
    title: constants.walletTitles.coinbase,
  },
  {
    id: constants.walletNames.zenGo,
    title: constants.walletTitles.zenGo,
  },
  {
    id: constants.walletNames.monitorAddress,
    title: constants.walletTitles.monitorAddress,
  },
  {
    id: constants.walletNames.dAppBrowser,
    title: constants.walletTitles.dAppBrowser,
  },
]

const mobileList = [
  constants.walletNames.coinbase,
  constants.walletNames.walletConnect,
  constants.walletNames.monitorAddress,
] as string[]

const mobileWallets = walletList.filter(({ id }) => mobileList.includes(id))
const desktopWallets = walletList.filter(({ id }) => id !== constants.walletNames.dAppBrowser)

export const createcheckWalletList: Wrapper = ({ page, element }) => (
  async (isMobile?: boolean, withWalletConnect = true) => {
    let currentList = isMobile ? mobileWallets : desktopWallets

    if (!withWalletConnect) {
      currentList = currentList.filter(({ id }) => id !== constants.walletNames.walletConnect)
    }

    if (!isMobile) {
      // MM will not be displayed if window.ethereum is undefined
      await page.evaluate(() => {
        // @ts-ignore
        window.ethereum = {}
      })
    }

    await page.getByTestId('connect-button').click()

    for (const wallet of currentList) {
      await element.checkVisibility({ testId: `${wallet.id}-connector-button` })
      await element.checkText({ testId: `${wallet.id}-connector-button`, expectedText: wallet.title })
    }
  }
)
