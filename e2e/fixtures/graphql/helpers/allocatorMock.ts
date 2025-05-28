const allocatorMock = new Array(30).fill(null).map((_, index) => {
  const day = 86400000000

  return {
    apy: '0.3',
    timestamp: String(1731888000000000 + (day * index)),
    earnedAssets: '80530949104937',
    totalAssets: '2031465768921153400',
  }
})


export default allocatorMock
