import React from 'react'
import cx from 'classnames'
import methods from 'helpers/methods'
import { useConfig } from 'config'
import { formatUnits } from 'ethers'

import Text from '../../../Text/Text'
import Logo from '../../../Logo/Logo'
import type { LogoName } from '../../../Image/Image'
import FiatAmount from '../../../FiatAmount/FiatAmount'
import { ListboxOption } from '@headlessui/react'

import s from './Option.module.scss'


type OptionProps = {
  className?: string
  data: SwapToken
  active?: boolean
  dataTestId?: string
}

const Option: React.FC<OptionProps> = (props) => {
  const { className, data, dataTestId } = props
  const { name, title, address, balance, logo, units } = data

  const { address: userAddress } = useConfig()

  const formattedBalance = userAddress ? formatUnits(balance, units) : '0.00'

  return (
    <ListboxOption
      className={cx(
        className,
        s.option,
        'flex gap-12 items-center pl-16 pr-24 cursor-pointer data-active:bg-primary/10 data-focus:bg-primary/5'
      )}
      as="div"
      value={address}
      data-testid={`${dataTestId}-option-${name}`}
    >
      <div className="flex gap-12 items-center flex-1">
        <div className={cx(s.logo, 'flex rounded-full p-4')}>
          <Logo
            name={logo as LogoName}
            size={24}
          />
        </div>
        <div className="whitespace-nowrap">
          <div className="flex items-center gap-8">
            <Text
              message={name}
              color="dark"
              size="t14m"
            />
            {
              address && (
                <Text
                  className="opacity-50"
                  message={methods.shortenAddress(address)}
                  color="dark"
                  size="t12"
                />
              )
            }
          </div>
          <Text
            className="opacity-50"
            message={title}
            size="t12m"
            color="dark"
          />
        </div>
      </div>
      <div className="text-right">
        <Text
          message={methods.formatTokenValue(formattedBalance, true)}
          size="t14m"
          color="dark"
        />
        <FiatAmount
          className="opacity-50"
          amount={formattedBalance}
          token={name as Tokens}
          color="dark"
          size="t12"
        />
      </div>
    </ListboxOption>
  )
}


export default React.memo(Option)
