import React  from 'react'
import cx from 'classnames'
import { DialogTitle } from '@headlessui/react'

import Text from '../../../Text/Text'


export type TitleProps = {
  isWide: boolean
  title?: Intl.Message | string
  withBackButton: boolean
  isCloseButtonDisabled?: boolean
}

const Title: React.FC<TitleProps> = (props) => {
  const { title, isWide, isCloseButtonDisabled, withBackButton } = props

  return (
    <DialogTitle
      className={cx({
        'flex-1 text-center': !isWide,
        'ml-56': !isWide && !withBackButton && !isCloseButtonDisabled,
      })}
    >
      <Text
        message={title as Intl.Message}
        color="moon"
        size={isWide ? 'h32' : 'h24'}
      />
    </DialogTitle>
  )
}


export default React.memo(Title)
