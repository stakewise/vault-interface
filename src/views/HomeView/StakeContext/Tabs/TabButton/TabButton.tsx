import React, { forwardRef } from 'react'
import cx from 'classnames'

import { ButtonBase, Text, MagicIcon } from 'components'
import type { ButtonBaseProps } from 'components'

import s from './TabButton.module.scss'


type TabButtonProps = Pick<ButtonBaseProps, 'dataTestId' | 'onClick'> & {
  className?: string
  contentClassName?: string
  title: Intl.Message | string
  withLabel?: boolean
  withMagicIcon?: boolean
}

const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>((props, ref) => {
  const { className, contentClassName, title, dataTestId, withLabel, withMagicIcon, onClick } = props

  return (
    <ButtonBase
      ref={ref}
      className={cx(className, 'flex items-center px-12 py-6 gap-12 rounded-16')}
      dataTestId={dataTestId}
      onClick={onClick}
    >
      {
        withLabel && (
          <div className={cx(s.label, 'w-8 h-8 rounded-full')} />
        )
      }
      <div className={cx(contentClassName, 'flex items-center gap-4')}>
        {
          withMagicIcon && (
            <MagicIcon />
          )
        }
        <Text
          message={title}
          color="dark"
          size="t14m"
        />
      </div>
    </ButtonBase>
  )
})

TabButton.displayName = 'TabButton'


export default React.memo(TabButton)
