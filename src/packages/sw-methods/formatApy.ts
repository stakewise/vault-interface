const formatApy = (apy: number) => {
  const minimalValue = 0.0001

  if (!apy || isNaN(apy) || typeof apy !== 'number') {
    return '0.00 %'
  }

  const roundedApy = Math.abs(apy) < minimalValue ? 0 : Number(apy.toFixed(2))

  let [ integer, remainder = '0' ] = roundedApy.toString().split('.')

  integer = Number(integer).toLocaleString()

  remainder = remainder.length > 1
    ? remainder.slice(0, 2)
    : `${remainder}0`

  const result = `${integer}.${remainder} %`

  return result === '-0.00 %'
    ? '0.00 %'
    : result
}


export default formatApy
