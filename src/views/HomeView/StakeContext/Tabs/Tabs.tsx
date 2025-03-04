'use client'
import React from 'react'
import cx from 'classnames'
import { useStore } from 'hooks'
import { useConfig } from 'config'
import { useTabButton } from 'sw-hooks'
import device from 'sw-modules/device'

import { stakeCtx, Tab } from 'views/HomeView/StakeContext/util'

import TabButton from './TabButton/TabButton'
import FlipButton from './FlipButton/FlipButton'

import { useTabs } from './util'


const storeSelector = (store: Store) => ({
  unboostQueue: store.vault.user.unboostQueue.data,
  unstakeQueue: store.vault.user.exitQueue.data,
})

type TabsProps = {
  className?: string
}

const Tabs: React.FC<TabsProps> = (props) => {
  const { className } = props

  const { isEthereum } = useConfig()
  const { tabs } = stakeCtx.useData()
  const { isMobile } = device.useData()
  const { unboostQueue, unstakeQueue } = useStore(storeSelector)

  const { tabIndex, tabsList, toggleReversed } = useTabs()

  const isClaimAvailable = Boolean(unboostQueue.isClaimable || unstakeQueue.withdrawable)

  const { tabButtonRef, containerRef } = useTabButton({
    gap: isMobile ? 4 : 12,
    index: tabIndex,
  }, [ tabsList, isClaimAvailable ])

  return (
    <div className={cx(className, 'flex items-center justify-start gap-12 mobile:gap-4')}>
      {
        isEthereum && (
          <FlipButton
            onClick={toggleReversed}
          />
        )
      }
      <div
        ref={containerRef}
        className={cx(
          'flex items-center justify-start gap-12 mobile:gap-4',
          'relative'
        )}
      >
        {
          tabsList.map(({ id, title }) => {
            const isActive = id === tabs.value

            return (
              <TabButton
                key={id}
                className="group"
                contentClassName={cx('group-hover:opacity-100', {
                  'opacity-50': !isActive,
                })}
                title={title}
                withLabel={isClaimAvailable && id === Tab.Balance}
                withMagicIcon={id === Tab.Boost}
                dataTestId={`tab-${id}`}
                onClick={() => {
                  if (!isActive) {
                    tabs.setTab(id)
                  }
                }}
              />
            )
          })
        }
        <div
          ref={tabButtonRef}
          className={cx(
            'bg-moon/10 rounded-16',
            'absolute top-0 left-0 transition-all duration-200 pointer-events-none'
          )}
        />
      </div>
    </div>
  )
}


export default React.memo(Tabs)
