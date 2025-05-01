import React, { useMemo } from 'react'
import cx from 'classnames'
import kit from 'modules/kit-provider'

import { constants } from '../../helpers'
import getImageStyle from './util/getImageStyle'
import { images, icons, logos } from './util/images'

import s from './Image.module.scss'


export type IconName = typeof icons[number]
export type LogoName = typeof logos[number]
export type ImageName = typeof images[number]

type Color = typeof constants.colors[number]

export type ImageProps = {
  className?: string
  name: ImageName
  size?: number
  color?: Color | 'inherit'
  dataTestId?: string
  ref?: React.RefObject<HTMLDivElement>
}

const Image: React.FC<ImageProps> = (props) => {
  const { className, name, color, size = 32, ref, dataTestId } = props

  const { imagesUrls = {} } = kit.useData()

  const imageUrl = imagesUrls[name]

  if (!images.includes(name)) {
    console.error(`Need to add image ${name} to kit`)
  }
  else if (!imageUrl) {
    console.error(`Need to add image url for ${name} to KitProvider`)
  }

  const style = useMemo(() => (
    getImageStyle({ size, color, imageUrl })
  ), [ imageUrl, size, color ])

  if (!imageUrl) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cx(className, s.image, 'inline-block', {
        'bg-light': color === 'light',
        'bg-dark': color === 'dark',
        'bg-black': color === 'black',
        'bg-white': color === 'white',
        'bg-primary': color === 'primary',
        'bg-secondary': color === 'secondary',
        'bg-smoke': color === 'smoke',
        'bg-warning': color === 'warning',
        'bg-success-light': color === 'success-light',
        'bg-success': color === 'success',
        'bg-error': color === 'error',
        'bg-titanium': color === 'titanium',
        'bg-dark-opacity': color === 'dark-opacity',
      })}
      style={style}
      data-testid={dataTestId}
    />
  )
}

Image.displayName = 'Image'


export { icons, logos, images }

export default React.memo(Image)
