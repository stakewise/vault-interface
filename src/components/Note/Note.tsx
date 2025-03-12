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
      return 'error'
    }
    if (type === 'warning') {
      return 'warning'
    }
    if (type === 'success') {
      return 'success-light'
    }

    return 'primary'
  }, [ type ])

  return (
    <div
      className={cx(className, 'py-16 px-24 mt-24 rounded-12', {
        'bg-primary/10 border border-primary/30': type === 'info',
        'bg-success-light/10 border border-success-light/30': type === 'success',
        'bg-warning/10 border border-warning/30': type === 'warning',
        'bg-error/10 border border-error/30': type === 'error',
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
