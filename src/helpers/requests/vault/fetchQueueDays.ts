import fetch from 'helpers/methods/fetch'


type AvgExitQueueQueryPayload = {
  vaults: Array<{
    avgExitQueueLength: number
  }>
}
type Input = {
  sdk: SDK
  vaultAddress: string
}

const fetchQueueDays = async (values: Input) => {
  const { sdk, vaultAddress } = values

  try {
    const result = await fetch<AvgExitQueueQueryPayload>(sdk.config.api.backend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query AvgExitQueue($vaultAddress: String!)  {
            vaults(id: $vaultAddress) {
              avgExitQueueLength
            }
          }
        `,
        variables: {
          vaultAddress,
        },
      }),
    })

    const seconds = result.vaults?.[0]?.avgExitQueueLength || 0

    return Math.round(seconds / 86400)
  }
  catch (error: any) {
    console.error('fetchQueueDays', error)

    return 0
  }
}


export default fetchQueueDays
