import { DeviceActionStatus } from '@ledgerhq/device-management-kit'


const toPromise = <T>(observableLike: { observable: { subscribe: (cb: (s: any) => void) => void } }): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    observableLike.observable.subscribe((state) => {
      if (state.status === DeviceActionStatus.Completed) {
        resolve(state.output)
      }
      if (state.status === DeviceActionStatus.Error) {
        reject(state.error)
      }
    })
  })
}


export default toPromise
