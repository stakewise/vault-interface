'use client'
import React from 'react'
import cx from 'classnames'
import dynamic from 'next/dynamic'
import { useViewportHeight, useImagesPrefetch } from 'hooks'

import { imagesUrls } from 'components'

import Header from './Header/Header'
import CommonModals from './CommonModals/CommonModals'


import {
  useAccount,
  useFiatRates,
  useQueryParams,
  useMintTokenData,
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
  useQueryParams()
  useMintTokenData()
  useViewportHeight()
  useImagesPrefetch(imagesUrls)

  return (
    <div
      className={cx(s.container, 'flex flex-col overflow-y-hidden')}
    >
      <Header />
      <main className="flex-1 w-full flex">
        {children}
      </main>
      <CommonModals />
      <BottomLoader />
      <Notifications />
    </div>
  )
}


export default React.memo(AppLayout)
