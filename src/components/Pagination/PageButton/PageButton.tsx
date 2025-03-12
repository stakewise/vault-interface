import React from 'react'

import Text from '../../Text/Text'

import PaginationButton from '../PaginationButton/PaginationButton'


type PageButtonProps = {
  className?: string
  page: number
  isActive: boolean
  dataTestId?: string
  onClick: () => void
}

const PageButton: React.FC<PageButtonProps> = (props) => {
  const { className, page, isActive, dataTestId, onClick } = props

  return (
    <PaginationButton
      className={className}
      isActive={isActive}
      dataTestId={dataTestId}
      onClick={onClick}
    >
      <Text
        color="dark"
        message={String(page)}
        tag="span"
        size="t14"
      />
    </PaginationButton>
  )
}


export default React.memo(PageButton)
