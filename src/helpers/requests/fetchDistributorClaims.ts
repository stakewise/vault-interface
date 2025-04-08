import { getAddress } from 'ethers'
import methods from 'helpers/methods'


type Input = {
  url: string | readonly string[]
  address: string
}

type Output = Store['account']['distributorClaims']['data'] | null

type DistributorClaimsQueryPayload = {
  distributorClaims: {
    proof: string[]
    tokens: string[]
    unclaimedAmounts: string[]
    cumulativeAmounts: string[]
  }[]
}

const fetchDistributorClaims = async (values: Input): Promise<Output> => {
  const { address, url } = values

  return methods.fetch<DistributorClaimsQueryPayload>(url, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query DistributorClaims($address: Bytes!) {
          distributorClaims(where: { user: $address }) {
            proof
            tokens
            unclaimedAmounts
            cumulativeAmounts
          }
        }
      `,
      variables: {
        address: address.toLowerCase(),
      },
    }),
  })
    .then((data) => {
      const distributorClaims = data?.distributorClaims?.[0]

      if (distributorClaims) {
        return {
          ...distributorClaims,
          tokens: distributorClaims.tokens.map(getAddress),
        }
      }

      return null
    })
}


export default fetchDistributorClaims
