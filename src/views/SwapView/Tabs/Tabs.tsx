'use client'
import React from 'react'
import cx from 'classnames'
import { useConfig } from 'config'
import device from 'modules/device'
import { useStore , useTabButton } from 'hooks'

import { swapCtx, Tab } from 'views/SwapView/util'

import TabButton from './TabButton/TabButton'
import FlipButton from './FlipButton/FlipButton'


const storeSelector = (store: Store) => ({
  isMoreV2: store.vault.base.data.versions.isMoreV2,
  isMintTokenDisabled: store.vault.user.balances.mintToken.isDisabled,
  isUnboostQueueClaimable: store.vault.user.unboostQueue.data.isClaimable,
  unstakeQueueWithdrawable: store.vault.user.unstakeQueue.data.withdrawable,
})

type TabsProps = {
  className?: string
}

const Tabs: React.FC<TabsProps> = (props) => {
  const { className } = props

  const { isEthereum } = useConfig()
  const { tabs } = swapCtx.useData()
  const { isDesktop } = device.useData()

  const {
    isMoreV2,
    isMintTokenDisabled,
    isUnboostQueueClaimable,
    unstakeQueueWithdrawable,
  } = useStore(storeSelector)

  const selectedIndex = tabs.list.map(({ id }) => id).indexOf(tabs.value)
  const tabIndex = selectedIndex === -1 ? 0 : selectedIndex

  const isClaimAvailable = Boolean(isUnboostQueueClaimable || unstakeQueueWithdrawable)

  const withMint = !isMintTokenDisabled
  const withBoost = withMint && isEthereum && isMoreV2
  const withToggleButton = withMint || withBoost

  const { tabButtonRef, containerRef } = useTabButton({
    gap: !isDesktop ? 4 : 12,
    index: tabIndex,
  }, [ tabIndex, tabs.list, isClaimAvailable ])

  const gapClassName = cx({
    'gap-12': isDesktop,
    'gap-4': !isDesktop,
  })

  return (
    <div
      className={cx(className, gapClassName, 'flex items-center justify-start')}
    >
      {
        withToggleButton && (
          <FlipButton
            onClick={tabs.toggleTabs}
          />
        )
      }
      <div
        ref={containerRef}
        className={cx(
          gapClassName,
          'flex items-center justify-start',
          'relative'
        )}
      >
        {
          tabs.list.map(({ id, title }) => {
            const isActive = id === tabs.value

            return (
              <TabButton
                key={id}
                className="group"
                contentClassName={cx('group-hover:opacity-100', {
                  'opacity-50': !isActive,
                })}
                title={title}
                withLabel={isClaimAvailable && id === Tab.Balance && isDesktop}
                withMagicIcon={id === Tab.Boost && isDesktop}
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
            'bg-dark/10 rounded-16',
            'absolute top-0 left-0 transition-all duration-200 pointer-events-none'
          )}
        />
      </div>
    </div>
  )
}


export default React.memo(Tabs)
