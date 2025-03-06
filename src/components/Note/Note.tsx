import React, { useMemo } from 'react'
import cx from 'classnames'

import Text, { TextProps } from '../Text/Text'


export type NoteProps = Omit<TextProps, 'message' | 'color' | 'size'> & {
  className?: string
  text: Intl.Message
  type?: 'error' | 'info' | 'success' | 'warning'
  dataTestId?: string
}

const Note: React.FC<NoteProps> = (props) => {
  const { className, text, type = 'info', dataTestId, ...rest } = props

  const textColor = useMemo(() => {
    if (type === 'error') {
      return 'volcano'
    }
    if (type === 'warning') {
      return 'autumn'
    }
    if (type === 'success') {
      return 'forest'
    }

    return 'primary'
  }, [ type ])

  return (
    <div
      className={cx(className, 'py-16 px-24 mt-24 rounded-12', {
        'bg-primary/10 border border-primary/30': type === 'info',
        'bg-forest/10 border border-forest/30': type === 'success',
        'bg-autumn/10 border border-autumn/30': type === 'warning',
        'bg-volcano/10 border border-volcano/30': type === 'error',
      })}
      data-testid={dataTestId}
    >
      <Text
        message={text}
        color={textColor}
        size="t14m"
        {...rest}
      />
    </div>
  )
}


export default React.memo(Note)
