import React from 'react'
import modal from 'sw-modules/modal'
import device from 'sw-modules/device'
import { usePathname } from 'next/navigation'
import { useModalClose } from 'hooks'

import { Modal } from 'components'

import Slider, { SliderProps } from './Slider/Slider'

import { texts, images } from './util'

import messages from './messages'


type GuideModalProps = {
  ltv: 90 | 100
}

const slideCounts = [ 1, 2, 3, 6, 7 ]

export const [ GuideModal, openGuideModal ] = (
  modal.wrapper<GuideModalProps>(UNIQUE_FILE_ID, (props) => {
    const { ltv, closeModal } = props

    useModalClose({ closeModal })

    const pathname = usePathname()
    const { isMobile } = device.useData()

    const slideMessages = (() => {
      const isVaultPage = /^\/vault\/./.test(pathname)

      if (isVaultPage) {
        return ltv === 100 ? texts.ltv100 : texts.ltv90
      }

      return texts.stakePage
    })()

    const slideImages = isMobile ? images.portrait : images.landscape
    const slides: SliderProps['items'] = slideCounts.map((count) => ({
      text: slideMessages[count as keyof typeof slideMessages],
      image: slideImages[count as keyof typeof images.landscape],
    }))

    return (
      <Modal
        title={messages.title}
        closeModal={closeModal}
      >
        <Slider items={slides} />
      </Modal>
    )
  })
)
