const splitPercent = (amount: bigint, percent?: string | number) => {
  const fullPercent = 10_000n
  const percentNumber = Number(percent || 0) * 100
  const percentBI = BigInt(percentNumber.toFixed(0))

  return [
    amount * percentBI / fullPercent,
    amount * (fullPercent - percentBI) / fullPercent,
  ]
}


export default splitPercent
