import React from 'react'
import cx from 'classnames'

import { FiatAmount, ButtonBase, TokenAmount, Text, Bone } from 'components'

import useAccountItem from './util/useAccountItem'


export type AccountItemProps = {
  address: string
  isActive: boolean
  onClick: (value: AccountItemProps['address']) => void
}

const AccountItem: React.FC<AccountItemProps> = (props) => {
  const { isActive, address, onClick } = props

  const {
    token,
    balance,
    shortenAddress,
    handleClick,
  } = useAccountItem({ address, isActive, onClick })

  return (
    <ButtonBase
      className={cx('flex flex-col items-center justify-center p-24 rounded-8', {
        'bg-moon/05': !isActive,
        'bg-ocean/20 border border-ocean': isActive,
      })}
      onClick={handleClick}
    >
      <Text
        message={shortenAddress as Intl.Message | string}
        color="moon"
        size="t14b"
      />
      {
        Boolean(balance) ? (
          <>
            <TokenAmount
              className="mt-8"
              value={balance as string}
              token={token as 'ETH'}
              size="md"
            />
            <FiatAmount
              className="mt-4 text-center opacity-60"
              token={token}
              amount={balance as string}
              color="moon"
              size="t12m"
            />
          </>
        ) : (
          <>
            <Bone
              className="mt-8"
              delay={1}
              w={110}
              h={24}
            />
            <Bone
              className="mt-4"
              delay={1}
              w={110}
              h={18}
            />
          </>
        )
      }
    </ButtonBase>
  )
}


export default React.memo(AccountItem)
