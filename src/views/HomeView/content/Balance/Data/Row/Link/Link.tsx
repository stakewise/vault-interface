import React from 'react'
import cx from 'classnames'

import { Text, Icon, IconName, ButtonBase } from 'components'


export type LinkProps = {
  className?: string
  title: Intl.Message
  icon: IconName
  onClick: () => void
}

const Link: React.FC<LinkProps> = (props) => {
  const { className, title, icon, onClick } = props

  return (
    <div className={cx(className, 'flex justify-start items-center')}>
      <ButtonBase onClick={onClick}>
        <Icon
          className="mr-4"
          name={icon}
          color="ocean"
          size={16}
        />
        <Text
          className="hover:underline"
          message={title}
          color="ocean"
          size="t14m"
        />
      </ButtonBase>
    </div>
  )
}


export default React.memo(Link)
