import walletNames from './walletNames'
import walletTitles from './walletTitles'


const walletList = [
  {
    id: walletNames.metaMask,
    title: walletTitles.metaMask,
    logo: 'connector/metamask',
  },
  {
    id: walletNames.walletConnect,
    title: walletTitles.walletConnect,
    logo: 'connector/walletConnect',
  },
  {
    id: walletNames.braveWallet,
    title: walletTitles.braveWallet,
    logo: 'connector/braveBrowser',
  },
  {
    id: walletNames.rabby,
    title: walletTitles.rabbyWallet,
    logo: 'connector/rabby',
  },
  {
    id: walletNames.ledger,
    title: walletTitles.ledger,
    logo: 'connector/ledger',
  },
  {
    id: walletNames.coinbase,
    title: walletTitles.coinbase,
    logo: 'connector/coinbase',
  },
  {
    id: walletNames.zenGo,
    title: walletTitles.zenGo,
    logo: 'connector/zengo',
  },
  {
    id: walletNames.taho,
    title: walletTitles.taho,
    logo: 'connector/taho',
  },
  {
    id: walletNames.okx,
    title: walletTitles.okx,
    logo: 'connector/okx',
  },
  {
    id: walletNames.trustWallet,
    title: walletTitles.trustWallet,
    logo: 'connector/trustWallet',
  },
  {
    id: walletNames.monitorAddress,
    title: walletTitles.monitorAddress,
    logo: 'connector/monitorAddress',
  },
  {
    id: walletNames.dAppBrowser,
    title: walletTitles.dAppBrowser,
    logo: 'connector/monitorAddress',
  },
  {
    id: walletNames.gnosisSafe,
    title: walletTitles.gnosisSafe,
    logo: 'connector/gnosisSafe',
  },
] as const


export default walletList
