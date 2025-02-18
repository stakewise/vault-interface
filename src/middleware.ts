import { chains } from 'sdk'
import { constants } from 'helpers'
import { NextRequest } from 'next/server'
import { setCookieBatch } from 'sw-helpers/_SSR'
import { languageMiddleware } from 'sw-modules/intl/_SSR'
import { createNetworkMiddleware } from 'sw-core/config/_SSR'


const networkMiddleware = createNetworkMiddleware({
  defaultNetworkId: chains.mainnet.id,
  supportedNetworkIds: [
    chains.gnosis.id,
    chains.chiado.id,
    chains.holesky.id,
    chains.mainnet.id,
  ],
  middlewareFn: async (request) => {
    return null
  },
})

const middleware = async (request: NextRequest) => {
  request.headers.set(constants.headerNames.pathname, request.nextUrl.pathname)

  const language = languageMiddleware(request)
  const network = await networkMiddleware(request)

  const cookies = [
    language,
    network,
  ]

  // ATTN: All cookies on the SSR should be set at 1 time and through this helper
  const response = setCookieBatch(request, cookies)

  return response
}


export const config = {
  matcher: [ '/((?!api|_next|.*\\..*).*)' ],
}


export default middleware
