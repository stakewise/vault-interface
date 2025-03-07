import React from 'react'

import RoundButton from '../../../RoundButton/RoundButton'

import messages from './messages'


type CloseButtonProps = {
  dataTestId?: string
  onClick: () => void
}

const CloseButton: React.FC<CloseButtonProps> = (props) => {
  const { dataTestId, onClick } = props

  return (
    <RoundButton
      className="flex-none ml-24"
      icon="icon/close"
      color="secondary"
      size={32}
      ariaLabel={messages.closeModal}
      dataTestId={dataTestId ? `${dataTestId}-close` : 'close'}
      onClick={onClick}
    />
  )
}


export default React.memo(CloseButton)
