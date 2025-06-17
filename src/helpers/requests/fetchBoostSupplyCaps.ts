import methods from '../methods'


type Input = {
  url: string | readonly string[]
}

type Output = bigint | null

type BoostSupplyCapsQueryPayload = {
  aave: {
    osTokenSupplyCap: string
    osTokenTotalSupplied: string
  }
}

const fetchBoostSupplyCaps = async (values: Input): Promise<Output> => {
  const { url } = values

  return methods.fetch<BoostSupplyCapsQueryPayload>(url, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query BoostSupplyCaps {
          aave(id: 1) {
            osTokenSupplyCap
            osTokenTotalSupplied
          }
        }
      `,
    }),
  })
    .then((data) => {
      if (data?.aave) {
        const { osTokenSupplyCap, osTokenTotalSupplied } = data.aave

        return BigInt(osTokenSupplyCap) - BigInt(osTokenTotalSupplied)
      }

      return null
    })
}


export default fetchBoostSupplyCaps
