import React from 'react'
import cx from 'classnames'
import methods from 'helpers/methods'
import { useConfig } from 'config'
import intl from 'modules/intl'
import { commonMessages } from 'helpers'

import Logo from '../../Logo/Logo'
import Icon from '../../Icon/Icon'
import Tooltip from '../../Tooltip/Tooltip'
import Text, { TextProps } from '../../Text/Text'

import messages from './messages'


export type BoostPercentProps = {
  userApy: number
  type: 'vault' | 'swap'
  isDangerous: boolean
  isUnprofitable: boolean
  dataTestId?: string
}

const recapitalizeFirstLetter = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

const BoostPercent: React.FC<BoostPercentProps> = (props) => {
  const {
    type,
    userApy,
    isDangerous,
    isUnprofitable,
    dataTestId,
  } = props

  const { sdk } = useConfig()
  const intlRef = intl.useIntlRef()

  const formattedApy = methods.formatApy(userApy)
  const isProfitable = !isDangerous && !isUnprofitable

  let tooltip: Intl.Message | undefined = undefined,
    textColor: TextProps['color'] = 'dark'

  const apyType = type === 'vault'
    ? intlRef.current.formatMessage(messages.vault)
    : sdk.config.tokens.mintToken

  if (isUnprofitable) {
    textColor = 'warning'
    tooltip = {
      ...messages.tooltips.notProfitable,
      values: {
        type: recapitalizeFirstLetter(apyType),
      },
    }
  }
  else if (isDangerous) {
    textColor = 'error'
    tooltip = {
      ...messages.tooltips.dangerous,
      values: {
        type: recapitalizeFirstLetter(apyType),
      },
    }
  }
  else if (isProfitable) {
    textColor = 'inherit'
  }

  const content = (
    <div className="flex items-center justify-between">
      {
        isProfitable ? (
          <Logo
            className="mr-4"
            name="image/magic"
            size={16}
          />
        ) : (
          <Icon
            className="mr-4"
            name="icon/warning"
            color={isDangerous ? 'error' : 'warning'}
            size={16}
          />
        )
      }
      <Text
        className={cx({ 'text-secondary-gradient': isProfitable })}
        dataTestId={dataTestId}
        message={formattedApy}
        color={textColor}
        size="t14m"
      />
    </div>
  )

  if (tooltip) {
    return (
      <Tooltip
        textCenter={false}
        content={tooltip}
      >
        {content}
      </Tooltip>
    )
  }

  return content
}


export default React.memo(BoostPercent)
