import { CSSProperties } from 'react'


type Input = {
  size?: number
  color?: string
  imageUrl: string
}

const getImageStyle = ({ size, color, imageUrl }: Input) => {
  const remSize = size ? `${size}rem` : undefined

  const dimensions: CSSProperties = {
    width: remSize,
    minWidth: remSize,
    height: remSize,
  }

  const url = `url(${imageUrl})`

  if (color) {
    return {
      ...dimensions,
      maskImage: url,
      WebkitMaskImage: url,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center center',
      WebkitMaskSize: 'contain',
    }
  }

  return {
    ...dimensions,
    backgroundImage: url,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  }
}


export default getImageStyle
