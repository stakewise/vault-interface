import React, { ReactNode } from 'react'
import { Description } from '@headlessui/react'
import device from 'sw-modules/device'
import cx from 'classnames'

import Text from '../../Text/Text'
import Href from '../../Href/Href'

import Title from './Title/Title'
import BackButton from './BackButton/BackButton'
import CloseButton from './CloseButton/CloseButton'
import Buttons, { ButtonsProps } from './Buttons/Buttons'


export type ContentProps = ButtonsProps & {
  dataTestId?: string
  children?: ReactNode
  bottomNode?: ReactNode
  contentClassName?: string
  title?: Intl.Message | string
  isCloseButtonDisabled?: boolean
  subTitle?: Intl.Message | string
  description?: Intl.Message | string
  onBackButtonClick?: () => void
  handleClose: () => void
}

const Content: React.FC<ContentProps> = (props) => {
  const {
    size,
    title,
    children,
    subTitle,
    bottomNode,
    dataTestId,
    description,
    primaryButton,
    secondaryButton,
    contentClassName,
    customPrimaryButton,
    isCloseButtonDisabled,
    onBackButtonClick,
    handleClose,
  } = props

  const { isMobile } = device.useData()

  const isWide = size === 'wide'
  const isNarrow = size === 'narrow'
  const withBackButton = typeof onBackButtonClick === 'function'

  const titleNode = Boolean(title) && (
    <Title
      title={title}
      isWide={isWide}
      withBackButton={withBackButton}
      isCloseButtonDisabled={isCloseButtonDisabled}
    />
  )

  const descriptionNode = Boolean(description) && (
    <Text
      className="mt-24"
      message={description as Intl.Message}
      HrefComponent={Href}
      color="moon"
      size="t14"
      html
    />
  )

  return (
    <>
      <div
        className={cx('flex', {
          'items-start': isWide,
          'items-center': !isWide,
        })}
      >
        {
          isWide ? (
            <div className="flex-1">
              {
                Boolean(subTitle) && (
                  <Text
                    className="mb-4"
                    message={subTitle as Intl.Message}
                    color="moon"
                    size="t14"
                  />
                )
              }
              {titleNode}
              {descriptionNode}
            </div>
          ) : (
            <>
              {
                withBackButton && (
                  <BackButton
                    dataTestId={dataTestId}
                    onClick={onBackButtonClick}
                  />
                )
              }
              {titleNode}
            </>
          )
        }
        {
          !isCloseButtonDisabled && (
            <CloseButton
              dataTestId={dataTestId}
              onClick={handleClose}
            />
          )
        }
      </div>
      <Description
        as="div"
        className={cx(contentClassName, 'mt-24 relative h-full', {
          'flex-1': isMobile,
        })}
      >
        {isNarrow && descriptionNode}
        {children}
      </Description>
      {bottomNode}
      {
        Boolean(primaryButton || secondaryButton) && (
          <Buttons
            size={size}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
            customPrimaryButton={customPrimaryButton}
          />
        )
      }
    </>
  )
}


export default React.memo(Content)
