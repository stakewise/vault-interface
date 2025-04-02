import React, { useRef, useCallback } from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import methods from 'helpers/methods'
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
      const rate = fiatRates[token][currency]
      const result = Number((rate * Number(point.value)).toFixed(2))
      const perfix = result < 0 ? '-' : ''
      const formattedResult = methods.numericalReduction(Math.abs(result))

      const fiatAmount = formattedResult === '0.00'
        ? `< ${perfix}${currencySymbol} 0.01`
        : `${perfix}${currencySymbol}${formattedResult}`

      fiatTooltipRef.current.innerHTML = `(${fiatAmount})`
    }
  }, [ currency, currencySymbol, fiatRates, token ])

  useSubscribe({ chart, series, callback })

  return (
    <div className={cx(className, 'flex items-center gap-4')}>
      <Logo name={`token/${token}`} />
      <Text
        ref={tokenValueTooltipRef}
        message=""
        size="t18m"
        color="dark"
      />
      <Text
        ref={fiatTooltipRef}
        className="opacity-50"
        message=""
        color="dark"
        size="t14m"
      />
    </div>
  )
}


export default React.memo(Amount)
