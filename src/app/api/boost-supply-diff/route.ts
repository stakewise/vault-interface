import { NextResponse } from 'next/server'
import { constants } from 'helpers'


type SupplyResponse = {
  data: {
    reserve: {
      totalSupplies: string
      supplyCap: string
    }
  }
}

export async function GET() {
  // eslint-disable-next-line max-len
  const aaveSubgraph = 'https://gateway.thegraph.com/api/007fa8d2e10d5b2394388e4ed945d8ab/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g'

  try {
    const response = await fetch(`${aaveSubgraph}?t=${new Date().getTime()}`, {
      method: 'POST',
      headers: {
        'cache-control': 'no-store',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
            reserve(id:"0xf1c9acdc66974dfb6decb12aa385b9cd01190e380x2f39d218133afab8f2b819b1066c7e434ad94e9e") {
              totalSupplies
              supplyCap
            }
          }
        `,
      }),
    })

    if (response?.status !== 200) {
      throw new Error(`API request failed: ${response?.url}`)
    }

    const result = await response.json() as SupplyResponse

    const { totalSupplies, supplyCap } = result.data.reserve
    const supplyDiff = BigInt(supplyCap) * constants.blockchain.amount1 - BigInt(totalSupplies)

    return NextResponse.json(supplyDiff.toString(), { status: 200 })
  }
  catch (error: any) {
    const errorMessage = error?.message || error || 'Error'

    return NextResponse.json({ error: errorMessage }, { status: 502 })
  }
}


export const dynamic = 'force-dynamic'
