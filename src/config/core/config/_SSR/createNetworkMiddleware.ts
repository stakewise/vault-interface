import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import * as constants from 'helpers/constants'


const _validateNetwork = (network: any, supportedNetworkIds: NetworkIds[]) => {
  if (network) {
    const isValid = supportedNetworkIds.includes(network as NetworkIds)

    if (isValid) {
      return network
    }
  }
}

const _getNetwork = async (
  request: NextRequest,
  defaultNetworkId: NetworkIds,
  supportedNetworkIds: NetworkIds[]
): Promise<NetworkIds> => {
  let network: NetworkIds = defaultNetworkId

  const cookieValue = cookies().get(constants.cookieNames.networkId)?.value
  const queryValue = request.nextUrl.searchParams.get(constants.queryNames.networkId)

  const queryNetwork = _validateNetwork(queryValue, supportedNetworkIds)
  const cookieNetwork = _validateNetwork(cookieValue, supportedNetworkIds)

  if (queryNetwork) {
    network = queryNetwork
  }
  else if (cookieNetwork) {
    network = cookieNetwork
  }

  return network
}

type Input = {
  defaultNetworkId: NetworkIds
  supportedNetworkIds: NetworkIds[]
  middlewareFn?: (request: NextRequest) => Promise<NetworkIds | null>
}

const createNetworkMiddleware = (values: Input) => (
  async (request: NextRequest) => {
    const { defaultNetworkId, supportedNetworkIds, middlewareFn } = values

    let network = await _getNetwork(request, defaultNetworkId, supportedNetworkIds)

    if (typeof middlewareFn === 'function') {
      const value = await middlewareFn(request)

      if (value) {
        network = value
      }
    }

    const isValid = supportedNetworkIds.includes(network)

    if (!isValid) {
      network = defaultNetworkId
    }

    return {
      name: constants.cookieNames.networkId,
      value: network,
    }
  }
)


export default createNetworkMiddleware
