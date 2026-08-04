import React, { useRef, useCallback } from 'react'
import { createSelector, useSelector } from 'store'
import { methods } from 'helpers'
import cx from 'classnames'

import Text from '../../../Text/Text'
import Logo from '../../../Logo/Logo'
import { useSubscribe } from '../util'


export type AmountProps = {
  className?: string
  token: Tokens
  chart: Charts.Chart
  series: Charts.Series
}

const storeSelector = createSelector([
  (store: Store) => store.fiatRates.data,
  (store: Store) => store.currency.selected,
  (store: Store) => store.currency.symbol,
], (fiatRates, currency, currencySymbol) => ({
  currencySymbol,
  fiatRates,
  currency,
}))

const Amount: React.FC<AmountProps> = (props) => {
  const { className, token, chart, series } = props

  const { fiatRates, currency, currencySymbol } = useSelector(storeSelector)

  const fiatTooltipRef = useRef<HTMLDivElement>(null)
  const tokenValueTooltipRef = useRef<HTMLDivElement>(null)

  const callback = useCallback((point: Charts.Point) => {

    if (tokenValueTooltipRef.current) {
      tokenValueTooltipRef.current.innerHTML = methods.formatTokenValue(String(point.value), true)
    }

    if (fiatTooltipRef.current) {
      if (!point.value) {
        fiatTooltipRef.current.innerHTML = `(${currencySymbol} 0.00)`

        return
      }

      const rate = fiatRates[token][currency]
      const result = Number((rate * Number(point.value)).toFixed(2))
      const prefix = result < 0 ? '-' : ''
      const formattedResult = methods.numericalReduction(Math.abs(result))

      const fiatAmount = formattedResult === '0.00'
        ? `< ${prefix}${currencySymbol} 0.01`
        : `${prefix}${currencySymbol}${formattedResult}`

      fiatTooltipRef.current.innerHTML = `(${fiatAmount})`
    }
  }, [ currency, currencySymbol, fiatRates, token ])

  useSubscribe({ chart, series, callback })

  return (
    <div className={cx(className, 'flex items-center gap-4')}>
      <Logo name={`token/${token}`} size={20} />
      <Text
        className="font-medium"
        ref={tokenValueTooltipRef}
        message=""
        size="lg"
        color="dark"
      />
      <Text
        ref={fiatTooltipRef}
        className="opacity-50 font-medium"
        message=""
        color="dark"
        size="sm"
      />
    </div>
  )
}


export default React.memo(Amount)
