import React from 'react'
import { commonMessages } from 'helpers'
import { openGuideModal, GuideModal } from 'layouts/modals'

import { Table, StakeStats } from 'views/HomeView/common'
import { stakeCtx } from 'views/HomeView/StakeContext/util'

import { FieldValid, Href, Text } from 'components'

import { useOptions } from './util'


type BoostInfoProps = {
  className?: string
}

const BoostInfo: React.FC<BoostInfoProps> = (props) => {
  const { className } = props

  const { field } = stakeCtx.useData()
  const options = useOptions()

  return (
    <div className={className}>
      <FieldValid field={field} filled>
        {
          (isValid) => (
            isValid ? (
              <Table
                options={options}
              />
            ) : (
              <StakeStats />
            )
          )
        }
      </FieldValid>
      <div className="flex justify-center mt-16">
        <Href
          className="hover:opacity-90 cursor-pointer px-4"
          tabIndex="0"
          onClick={() => openGuideModal({ ltv: 100 })}
        >
          <Text
            message={commonMessages.buttonTitle.boostGuideLink}
            color="primary"
            size="t14m"
          />
        </Href>
      </div>
      <GuideModal />
    </div>
  )
}


export default React.memo(BoostInfo)
