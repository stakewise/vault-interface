import React from 'react'
import cx from 'classnames'
import { commonMessages } from 'helpers'

import { Note , Text } from 'components'

import { stakeCtx, Tab } from 'views/HomeView/StakeContext/util'

import s from './ExitQueueNote.module.scss'


type ExitQueueNoteProps = {
  className?: string
  action: 'boost' | 'unboost'
}

const ExitQueueNote: React.FC<ExitQueueNoteProps> = (props) => {
  const { className, action } = props

  const { tabs } = stakeCtx.useData()

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
      HrefComponent={() => (
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


export default React.memo(ExitQueueNote)
