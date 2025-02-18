import React from 'react'
import cx from 'classnames'

import Text, { TextSize } from '../../Text/Text'
// import Loader from '../../Loader/Loader'


export type ButtonContentProps = {
  className?: string
  title?: Intl.Message | string
  titleSize: TextSize
  loading?: boolean
}

const ButtonContent: React.FC<ButtonContentProps> = (props) => {
  const { className, title, titleSize, loading } = props

  return (
    <div className={cx(className, 'flex items-center gap-8')}>
      {/*{*/}
      {/*  loading && (*/}
      {/*    <Loader*/}
      {/*      className={iconClassName}*/}
      {/*      size={iconSize as IconSize}*/}
      {/*    />*/}
      {/*  )*/}
      {/*}*/}
      {
        Boolean(title) && (
          <Text
            message={title as string}
            size={titleSize}
            color="inherit"
          />
        )
      }
    </div>
  )
}


export default React.memo(ButtonContent)
