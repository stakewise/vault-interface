import { CurrenciesObject } from './store/fiatRates'


declare global {
  type Currency = keyof CurrenciesObject

  type InfinityPoolCategory = 'tribes' | 'diversify' | 'operators' | 'distributed'
}
