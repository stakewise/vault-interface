import { walletTitles } from 'helpers/constants'


const getConnector = () => null


export default {
  name: walletTitles.monitorAddress,
  getSpecialErrors: () => null,
  activationMessage: '',
  getConnector,
} as const
