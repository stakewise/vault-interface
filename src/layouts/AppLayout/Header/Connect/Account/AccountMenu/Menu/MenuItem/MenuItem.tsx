import React from 'react'
import cx from 'classnames'

import { Text, Icon, ButtonBase , Href } from 'components'


export type MenuItemProps = {
  className?: string
  title: Intl.Message | string
  to?: string
  dataTestId?: string
  onClick?: () => void
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { className, title, to, dataTestId, onClick } = props

  const itemNode = (
    <div className={cx(className, 'flex justify-between items-center w-full')}>
      <Text
        message={title}
        color="moon"
        size="t14m"
      />
      <Icon
        name="arrow/right"
        color="moon"
        size={16}
      />
    </div>
  )

  if (typeof onClick === 'function') {
    return (
      <ButtonBase
        className="block w-full"
        dataTestId={dataTestId}
        onClick={onClick}
      >
        {itemNode}
      </ButtonBase>
    )
  }

  if (to) {
    return (
      <Href
        to={to}
        dataTestId={dataTestId}
      >
        {itemNode}
      </Href>
    )
  }

  return null
}


export default React.memo(MenuItem)
