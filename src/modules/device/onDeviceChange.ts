import * as constants from 'helpers/constants'
import cookie from 'sw-helpers/cookie'


const onDeviceChange = (device: Device.Context) => {
  cookie.set(constants.cookieNames.device, JSON.stringify(device))
}


export default onDeviceChange
