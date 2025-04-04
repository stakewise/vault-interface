const getGasMargin = (value: bigint) => (value * 10_000n + 1000n) / 10_000n


export default getGasMargin
