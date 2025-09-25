import React from 'react'
import cx from 'classnames'
import { commonMessages } from 'helpers'

import { Note, Text } from 'components'

import { swapCtx, Tab } from 'views/SwapView/util'

import s from './ClaimUnboostQueueNote.module.scss'


type ClaimUnboostQueueNoteProps = {
  className?: string
  action: 'boost' | 'unboost'
}

const ClaimUnboostQueueNote: React.FC<ClaimUnboostQueueNoteProps> = (props) => {
  const { className, action } = props

  const { tabs } = swapCtx.useData()

  const actionText = action === 'boost'
    ? commonMessages.tooltip.boostDisabled
    : commonMessages.tooltip.unboostDisabled

  return (
    <Note
      className={cx(className, s.capitalizeFirst)}
      html
      type="warning"
      text={actionText}
      dataTestId="exit-queue-note"
      CustomComponent={() => (
        <Text
          className="underline lowercase align-baseline"
          color="warning"
          tag="button"
          size="t14m"
          dataTestId="balances-link"
          message={commonMessages.buttonTitle.claimed}
          onClick={() => tabs.setTab(Tab.Balance)}
        />
      )}
    />
  )
}


export default React.memo(ClaimUnboostQueueNote)
