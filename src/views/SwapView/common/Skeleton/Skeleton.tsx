import React, { useRef } from 'react'
import cx from 'classnames'
import { useConfig } from 'config'
import device from 'modules/device'
import { useSearchParams } from 'next/navigation'

import { Bone, Text, MagicIcon } from 'components'
import { Tab, swapCtx } from 'views/SwapView/util'


const Skeleton: React.FC = () => {
  const { isEthereum } = useConfig()
  const searchParams = useSearchParams()

  const { tabs } = swapCtx.useData()
  const { isDesktop } = device.useData()

  const isBalancesRef = useRef(Boolean(searchParams.get('balances')))

  return (
    <>
      <div className="flex items-center justify-start gap-12 mobile:gap-4">
        {
          isEthereum && (
            <Bone
              className="rounded-72"
              w={40}
              h={32}
            />
          )
        }
        {
          tabs.list.map(({ id, title }, index) => (
            <Bone
              key={id}
              className={cx('px-12 py-6 rounded-16', {
                'bg-dark/10': !index,
              })}
            >
              <div className="flex items-center gap-4 opacity-0">
                {
                  id === Tab.Boost && (
                    <MagicIcon />
                  )
                }
                <Text
                  message={title}
                  color="dark"
                  size="t14m"
                />
              </div>
            </Bone>
          ))
        }
      </div>
      {
        isBalancesRef.current ? (
          <div className="mt-20">
            <Bone
              className="rounded-8"
              h={201}
              wFull
              delay={1}
            />
            <Bone
              className="mt-24 rounded-8"
              h={94}
              wFull
              delay={2}
            />
          </div>
        ) : (
          <div className="mt-20">
            <Bone
              className="rounded-8"
              h={!isDesktop ? 90 : 108}
              wFull
              delay={1}
            />
            <Bone
              className="mt-8 rounded-8"
              h={70}
              wFull
              delay={2}
            />
            <Bone
              className="mt-8 rounded-8"
              h={67}
              wFull
              delay={3}
            />
          </div>
        )
      }
    </>
  )
}


export default React.memo(Skeleton)
