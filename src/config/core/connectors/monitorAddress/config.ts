import { walletTitles } from 'sw-helpers/constants'


const getConnector = () => null


export default {
  name: walletTitles.monitorAddress,
  getSpecialErrors: () => null,
  activationMessage: '',
  getConnector,
} as const
