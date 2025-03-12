type Input<T> = {
  minTime: number
  handler: () => Promise<T>
}

const increaseDelay = async <T>(values: Input<T>) => {
  const { minTime, handler } = values

  const start = new Date().getTime()

  const result = await handler()

  const stop = new Date().getTime()
  const diff = stop - start

  if (diff < minTime) {
    await new Promise((r) => setTimeout(r, minTime - diff))
  }

  return result
}


export default increaseDelay
