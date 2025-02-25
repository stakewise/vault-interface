import React from 'react'
import cx from 'classnames'

import { Text } from 'components'

import Box from '../Box/Box'
import Option, { OptionProps } from './Option/Option'


export type TableProps = {
  className?: string
  title?: Intl.Message
  options: OptionProps[]
}

const Table: React.FC<TableProps> = (props) => {
  const { className, title, options } = props

  return (
    <Box className={cx(className, 'p-16')}>
      {
        title && (
          <Text
            className="text-center mb-12"
            message={title}
            color="moon"
            size="t14b"
          />
        )
      }
      {
        options.map((option, index) => (
          <Option
            key={index}
            className={cx({ 'mt-16': index })}
            {...option}
          />
        ))
      }
    </Box>
  )
}


export default React.memo(Table)
