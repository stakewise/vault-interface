import { Config, Network } from '../types'
import { networks } from '../constants'


const buildEnv = (config: Config): string => {
  const lines: string[] = []

  const has = (net: Network): boolean => config.networks.includes(net)

  lines.push('# RPC URLs')

  for (const network of networks) {
    const upper = network.toUpperCase()

    lines.push(`NEXT_PUBLIC_${upper}_NETWORK_URL=${has(network) ? (config.rpcUrls[network] || '') : ''}`)
    lines.push(`NEXT_PUBLIC_${upper}_FALLBACK_URL=${has(network) ? (config.fallbackUrls[network] || '') : ''}`)
  }

  lines.push('')

  lines.push('# Vault addresses')

  for (const network of networks) {
    const upper = network.toUpperCase()

    lines.push(`NEXT_PUBLIC_${upper}_VAULT_ADDRESS=${has(network) ? (config.vaultAddresses[network] || '') : ''}`)
  }

  lines.push('')

  lines.push('# Owner')
  lines.push(`NEXT_PUBLIC_TITLE=${config.title.trim()}`)
  lines.push(`NEXT_PUBLIC_OWNER_DOMAIN=${config.ownerDomain.trim()}`)
  lines.push(`NEXT_PUBLIC_OWNER_X_ACCOUNT=${config.xAccount.trim()}`)

  lines.push('')

  lines.push(`NEXT_PUBLIC_WALLET_CONNECT_ID=${config.walletConnectId.trim()}`)
  lines.push(`NEXT_PUBLIC_REFERRER=${config.referrer.trim()}`)

  lines.push('')

  lines.push('# UI')
  lines.push(`NEXT_PUBLIC_LOCALES=${config.locales.join(', ')}`)
  lines.push(`NEXT_PUBLIC_CURRENCIES=${config.currencies.join(', ')}`)

  lines.push('')

  lines.push(`NEXT_PUBLIC_CONTENT_SECURITY_POLICY=${config.csp}`)

  return lines.join('\n') + '\n'
}


export default buildEnv
