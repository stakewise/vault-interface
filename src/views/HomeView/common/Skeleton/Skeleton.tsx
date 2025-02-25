import React, { useMemo, useRef } from 'react'
import cx from 'classnames'
import device from 'sw-modules/device'
import { useConfig } from 'config'
import { useSearchParams } from 'next/navigation'

import { Bone, Text, MagicIcon } from 'components'

import { Tab } from '../../StakeContext/util'
import { getTabsList } from '../../StakeContext/Tabs/util'


const Skeleton: React.FC = () => {
  const searchParams = useSearchParams()
  const { isEthereum } = useConfig()

  const { isMobile } = device.useData()

  const tabs = useMemo(() => getTabsList({ isEthereum }), [ isEthereum ])

  const isBalancesRef = useRef(Boolean(searchParams.get('balances')))

  return (
    <>
      <div className="flex items-center justify-start gap-12">
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
          tabs.map(({ id, title }, index) => (
            <Bone
              key={id}
              className={cx('px-12 py-6 rounded-16', {
                'bg-moon/10': !index,
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
                  color="moon"
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
              h={isMobile ? 92 : 108}
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
