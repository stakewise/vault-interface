'use client'
import React from 'react'
import cx from 'classnames'
import { useViewportHeight, useImagesPrefetch } from 'hooks'

import { imagesUrls } from 'components'

import Header from './Header/Header'

import {
  useFiatRates,
  useQueryParams,
  useMintTokenData,
  useAutoFetchBalances,
} from './util'

import s from './AppLayout.module.scss'
import dynamic from 'next/dynamic'


const BottomLoader = dynamic(() => import('./BottomLoader/BottomLoader'), {
  ssr: false,
})

const Notifications = dynamic(() => import('./Notifications/Notifications'), {
  ssr: false,
})

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFiatRates()
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
