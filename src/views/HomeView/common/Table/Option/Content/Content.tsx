import React from 'react'

import type { IconName } from 'components'
import { Text, Icon, Loading } from 'components'

import MagicPercent from '../../../MagicPercent/MagicPercent'

import type { Position } from '../../../../content/util/types'


export type ContentProps = {
  isMagicValue?: boolean
  isFetching?: boolean
  dataTestId?: string
  icon?: IconName
  value?: string
  textValue?: Position['textValue']
}

const Content: React.FC<ContentProps> = (props) => {
  const { value, textValue, icon, isFetching, isMagicValue, dataTestId } = props

  if (isFetching) {
    return (
      <Loading />
    )
  }

  if (textValue) {
    return (
      <div className="flex gap-4 justify-end items-center opacity-90">
        <Text
          message={textValue.prev.message}
          color="dark"
          size="t14m"
          dataTestId={`${dataTestId}-prev`}
        />
        <Icon
          name="arrow/right"
          color="dark"
          size={16}
        />
        <Text
          className={isMagicValue ? 'text-secondary-gradient' : ''}
          message={textValue.next.message}
          color="dark"
          size="t14m"
          dataTestId={textValue.next.dataTestId}
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
      <Text
        className="opacity-90"
        message={value as string}
        color="dark"
        size="t14m"
        dataTestId={dataTestId}
      />
    </div>
  )
}


export default React.memo(Content)
