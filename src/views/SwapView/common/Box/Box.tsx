import React from 'react'
import cx from 'classnames'


type BoxProps = {
  children: React.ReactNode
  className?: string
}

const Box: React.FC<BoxProps> = (props) => {
  const { children, className } = props

  return (
    <div className={cx(className, `border rounded-8 border-dark/20`)}>
      {children}
    </div>
  )
}


export default React.memo(Box)
