import * as constants from '../../constants'


type Wrapper = E2E.FixtureMethod<CheckWalletList, 'page' | 'element'>

export type CheckWalletList = (isMobile?: boolean, withWalletConnect?: boolean) => Promise<void>

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
    id: constants.walletNames.binance,
    title: constants.walletTitles.binance,
  },
  {
    id: constants.walletNames.coinbase,
    title: constants.walletTitles.coinbase,
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
]

const mobileWallets = walletList.filter(({ id }) => mobileList.includes(id))
const desktopWallets = walletList.filter(({ id }) => id !== constants.walletNames.dAppBrowser)

const connectClickTimeout = 30_000

export const createCheckWalletList: Wrapper = ({ page, element }) => (
  async (isMobile?: boolean, withWalletConnect = true) => {
    let currentList = isMobile ? mobileWallets : desktopWallets

    if (!withWalletConnect) {
      currentList = currentList.filter(({ id }) => id !== constants.walletNames.walletConnect)
    }

    // Without window.ethereum the wallet provider hangs in auto-connect and connect-button never mounts
    // Use addInitScript so eip6963 provider is announced before mipd store is created on page load
    await page.addInitScript(() => {
      // @ts-ignore
      window.ethereum = {}

      const info = Object.freeze({
        uuid: '350670db-19fa-4704-a166-e52e178b59d2',
        name: 'MetaMask',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=',
        rdns: 'metaMask',
      })
      const announce = () => {
        window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
          // @ts-ignore
          detail: Object.freeze({ info, provider: window.ethereum }),
        }))
      }
      window.addEventListener('eip6963:requestProvider', announce)
      announce()
    })

    await page.reload()

    await page.getByTestId('connect-button').click({ timeout: connectClickTimeout })

    for (const wallet of currentList) {
      await element.checkVisibility({ testId: `${wallet.id}-connector-button` })
      await element.checkText({ testId: `${wallet.id}-connector-button`, expectedText: wallet.title })
    }
  }
)
