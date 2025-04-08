'use client'
import React from 'react'
import cx from 'classnames'
import dynamic from 'next/dynamic'
import { useViewportHeight, useImagesPrefetch } from 'hooks'

import { imagesUrls } from 'components'

import Header from './Header/Header'

import {
  useAccount,
  useFiatRates,
  useVaultData,
  useQueryParams,
  useMintTokenData,
  useAutoFetchBalances,
} from './util'

import s from './AppLayout.module.scss'


const BottomLoader = dynamic(() => import('./BottomLoader/BottomLoader'), {
  ssr: false,
})

const Notifications = dynamic(() => import('./Notifications/Notifications'), {
  ssr: false,
})

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAccount()
  useFiatRates()
  useVaultData()
  useQueryParams()
  useMintTokenData()
  useViewportHeight()
  useAutoFetchBalances()
  useImagesPrefetch(imagesUrls)

  return (
    <div
      className={cx(s.container, 'flex flex-col overflow-y-hidden')}
    >
      <Header />
      <main className="flex-1 w-full flex">
        {children}
      </main>
      <BottomLoader />
      <Notifications />
    </div>
  )
}


export default React.memo(AppLayout)
