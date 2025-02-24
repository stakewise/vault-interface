import React from 'react'

import type { IconName } from 'components'
import { Text, Icon, Loading } from 'components'

import MagicPercent from '../../../MagicPercent/MagicPercent'


export type ContentProps = {
  isMagicValue?: boolean
  isFetching?: boolean
  dataTestId?: string
  icon?: IconName
  value?: string
  values?: {
    prev: string
    next: string
  }
}

const Content: React.FC<ContentProps> = (props) => {
  const { value, values, icon, isFetching, isMagicValue, dataTestId } = props

  if (isFetching) {
    return (
      <Loading />
    )
  }

  if (values) {
    return (
      <div className="flex gap-4 justify-end items-center opacity-90">
        <Text
          message={values.prev}
          color="moon"
          size="t14m"
          dataTestId={`${dataTestId}-prev`}
        />
        <Icon
          name="arrow/right"
          color="moon"
          size={16}
        />
        <Text
          className={isMagicValue ? 'text-fancy-sunset' : ''}
          message={values.next}
          color="moon"
          size="t14m"
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
            color="moon"
            size={16}
          />
        )
      }
      <Text
        className="opacity-90"
        message={value as string}
        color="moon"
        size="t14m"
        dataTestId={dataTestId}
      />
    </div>
  )
}


export default React.memo(Content)
