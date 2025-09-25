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
      <div className="flex gap-4 justify-end items-center">
        <Text
          className="font-medium"
          message={values.prev}
          color="dark"
          size="t14"
          dataTestId={`${dataTestId}-prev`}
        />
        <Icon
          name="arrow/right"
          color="dark"
          size={16}
        />
        <Text
          className={isMagicValue ? 'text-secondary-gradient font-medium' : 'font-medium'}
          message={values.next}
          color="dark"
          size="t14"
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
            className="mr-4"
            name={icon as IconName}
            color="dark"
            size={16}
          />
        )
      }
      <Text
        className="font-medium"
        message={value as string}
        color="dark"
        size="t14"
        dataTestId={dataTestId}
      />
    </div>
  )
}


export default React.memo(Content)
