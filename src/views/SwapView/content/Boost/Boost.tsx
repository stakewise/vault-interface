import React from 'react'
import { swapCtx } from 'views/SwapView/util'

import { Form } from 'components'

import BoostInput from './BoostInput/BoostInput'
import BoostContent from './BoostContent/BoostContent'


const Boost: React.FC = () => {
  const { boost } = swapCtx.useData()

  return (
    <Form className="mt-20">
      <BoostInput
        field={boost.field}
        balance={boost.maxBoostShares}
        isLoading={boost.isBoostLoading}
      />
      <BoostContent
        className="mt-24"
        field={boost.field}
        isBoostLoading={boost.isBoostLoading}
        isBoostDisabled={boost.isBoostDisabled}
        transactionPrice={boost.transactionPrice}
        boostDisabledTooltip={boost.boostDisabledTooltip}
        openGuideModal={boost.openGuideModal}
        submit={boost.submit}
      />
    </Form>
  )
}


export default React.memo(Boost)
