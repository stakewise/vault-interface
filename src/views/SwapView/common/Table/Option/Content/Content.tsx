import React from 'react'

import type { IconName, LogoName } from 'components'
import { Text, Icon, Loading, Logo } from 'components'

import MagicPercent from '../../../MagicPercent/MagicPercent'


export type ContentProps = {
  isMagicValue?: boolean
  isFetching?: boolean
  dataTestId?: string
  icon?: IconName
  logo?: LogoName
  value?: string
  values?: {
    prev: string
    next: string
  }
}

const Content: React.FC<ContentProps> = (props) => {
  const { value, values, icon, logo, isFetching, isMagicValue, dataTestId } = props

  if (isFetching) {
    return (
      <Loading />
    )
  }

  if (values) {
    return (
      <div className="flex gap-4 justify-end items-center">
        {
          Boolean(logo) && (
            <Logo
              name={logo as LogoName}
              size={16}
            />
          )
        }
        <Text
          className="font-medium"
          message={values.prev}
          color="dark"
          size="sm"
          dataTestId={`${dataTestId}-prev`}
        />
        <Icon
          name="arrow/right"
          color="dark"
          size={16}
        />
        {
          Boolean(logo) && (
            <Logo
              name={logo as LogoName}
              size={16}
            />
          )
        }
        <Text
          className={isMagicValue ? 'text-primary font-medium' : 'font-medium'}
          message={values.next}
          color="dark"
          size="sm"
          dataTestId={`${dataTestId}-next`}
        />
      </div>
    )
  }

  if (isMagicValue) {
    return (
      <MagicPercent
        value={value as string}
        dataTestId={dataTestId}
      />
    )
  }

  return (
    <div className="flex justify-end items-center">
      {
        Boolean(icon) && (
          <Icon
            className="mr-4 opacity-50"
            name={icon as IconName}
            color="dark"
            size={16}
          />
        )
      }
      {
        Boolean(logo) && (
          <Logo
            className="mr-4"
            name={logo as LogoName}
            size={16}
          />
        )
      }
      <Text
        className="font-medium"
        message={value as string}
        color="dark"
        size="sm"
        dataTestId={dataTestId}
      />
    </div>
  )
}


export default React.memo(Content)
