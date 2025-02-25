import React from 'react'

import RoundButton from '../../../RoundButton/RoundButton'

import messages from './messages'


type BackButtonProps = {
  dataTestId?: string
  onClick: () => void
}

const BackButton: React.FC<BackButtonProps> = (props) => {
  const { dataTestId, onClick } = props

  return (
    <RoundButton
      className="flex-none mr-24"
      ariaLabel={messages.goBack}
      icon="arrow/left"
      color="stone"
      size={32}
      data-testid={dataTestId ? `${dataTestId}-back` : 'back'}
      onClick={onClick}
    />
  )
}


export default React.memo(BackButton)
