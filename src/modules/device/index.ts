import ctx from './ctx'
import onDeviceChange from './onDeviceChange'


declare global {

  namespace Device {

    type Context = {
      isTablet: boolean
      isMobile: boolean
      isDesktop: boolean
      isCalculated: boolean
    }

    type Input = {
      initialValue: Context
      onChange: (device: Context) => void
    }
  }
}

export { onDeviceChange }
export default ctx
