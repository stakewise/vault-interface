import { createStore } from 'mipd'


const providerStore = typeof window !== 'undefined'
  ? createStore()
  : null


export const findProvider = (rdns: string): any => {
  return providerStore?.findProvider({ rdns })?.provider || null
}

export const findProviderIcon = (rdns: string): string | undefined => {
  return providerStore?.findProvider({ rdns })?.info.icon
}

export const getAutoDetectedProviders = () => {
  return providerStore?.getProviders() || []
}
