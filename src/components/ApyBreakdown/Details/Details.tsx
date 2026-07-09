import React, { useMemo } from 'react'
import cx from 'classnames'
import date from 'modules/date'
import intl from 'modules/intl'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { commonMessages, methods } from 'helpers'

import Logo from '../../Logo/Logo'
import Text from '../../Text/Text'

import messages from './messages'


const storeSelector = (store: Store) => ({
  maxBoostApy: store.vault.base.data.allocatorMaxBoostApy,
})

type Data = {
  apy: string
  token: string
  endTimestamp?: string
}

export type DetailsProps = {
  className?: string
  data: Data[]
  maxBoostApy: number
  withText?: boolean
}

const Details: React.FC<DetailsProps> = (props) => {
  const { className, data, withText } = props

  const now = date.time()
  const { sdk } = useConfig()
  const intlRef = intl.useIntlRef()
  const { maxBoostApy } = useStore(storeSelector)

  const tokenList = useMemo(() => {
    const SSV = sdk.config.addresses.tokens.ssv.toLocaleLowerCase()
    const obol = sdk.config.addresses.tokens.obol.toLocaleLowerCase()
    const SWISE = sdk.config.addresses.tokens.swise.toLocaleLowerCase()
    const mintToken = sdk.config.addresses.tokens.mintToken.toLocaleLowerCase()
    const depositToken = sdk.config.addresses.tokens.depositToken.toLocaleLowerCase()

    return ({
      [SSV]: sdk.config.tokens.ssv,
      [obol]: sdk.config.tokens.obol,
      [SWISE]: sdk.config.tokens.swise,
      [mintToken]: sdk.config.tokens.mintToken,
      [depositToken]: sdk.config.tokens.depositToken,
    })
  }, [ sdk ])

  return (
    <div className={className}>
      {
        data.map(({ apy, token, endTimestamp }, index) => {
          const timeThen = date.time.unix(Number(endTimestamp) || 0)
          const difference = date.time.duration(timeThen.diff(now))
          const daysLeft = Math.floor(difference.asDays())
          const hoursLeft = Math.floor(difference.asHours())

          const days = `${daysLeft}${intlRef.current.formatMessage(commonMessages.time.days)}`
          const hours = `~${hoursLeft}${intlRef.current.formatMessage(commonMessages.time.hours)}`
          const oneHour = `<1${intlRef.current.formatMessage(commonMessages.time.hours)}`
          const timeInDaysOrHours = daysLeft > 0 ? days : hours
          const timeLeft = hoursLeft > 0 ? timeInDaysOrHours : oneHour

          return (
            <div
              key={index}
              className={cx('flex justify-between items-center border-dark/20', {
                'pt-12 mt-12 border-top': index,
              })}
            >
              <div className="flex items-center gap-8">
                <Logo
                  name={`token/${tokenList[token]}`}
                  size={24}
                />
                <div className="flex flex-col">
                  <Text
                    className="font-medium"
                    message={tokenList[token]}
                    size="sm"
                    color="dark"
                  />
                  {
                    endTimestamp && (
                      <div className="flex">
                        <Text
                          className="opacity-50"
                          message={{
                            ...messages.endTime,
                            values: {
                              time: timeLeft,
                            },
                          }}
                          color="dark"
                          size="xs"
                        />
                      </div>
                    )
                  }
                </div>
              </div>
              <Text
                className="font-medium"
                size="md"
                color="dark"
                message={methods.formatApy(Number(apy))}
              />
            </div>
          )
        })
      }
      {
        withText && (
          <Text
            className={cx('border-dark/20 text-center opacity-70 font-medium', {
              'pt-12 mt-12 border-top': data.length,
            })}
            size="sm"
            color="dark"
            message={{
              ...messages.tooltip,
              values: {
                percent: methods.formatApy(maxBoostApy),
                mintToken: sdk.config.tokens.mintToken,
              },
            }}
          />
        )
      }
    </div>
  )
}


export default React.memo(Details)
