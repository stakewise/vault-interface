const method = (promises: Array<Promise<unknown>>) => {
  const mappedPromises = promises.map((promise) => (
    promise
      .then((value) => {
        return {
          status: 'fulfilled',
          value,
        }
      })
      .catch((reason) => {
        return {
          status: 'rejected',
          reason,
        }
      })
  ))

  return Promise.all(mappedPromises)
}


export default () => {
  if (typeof Promise.allSettled !== 'function') {
    // @ts-ignore
    Promise.allSettled = method
  }
}
