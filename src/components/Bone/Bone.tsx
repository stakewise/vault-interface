import React, { useMemo, CSSProperties } from 'react'
import cx from 'classnames'

import type { TextSize } from '../Text/Text'

import s from './Bone.module.scss'


export type BoneProps = {
  className?: string
  children?: React.ReactNode
  w?: number
  h?: number
  wFull?: boolean
  delay?: 1 | 2 | 3
  aspect?: number
  textSize?: TextSize
  styles?: CSSProperties
}

const Bone: React.FC<BoneProps> = (props) => {
  const {
    className, children,
    w: width, h: height, styles = {},
    wFull, delay = 0, aspect, textSize,
  } = props

  const style = useMemo(() => {
    const style: any = styles

    if (width) {
      style.width = style.minWidth = `${width}rem`
    }

    if (height) {
      style.height = style.minHeight = `${height}rem`
    }

    return style
  }, [ width, height, styles ])

  const placeholderStyle = useMemo(() => {
    if (aspect) {
      return {
        paddingTop: `${Math.round(100 / aspect)}%`,
      }
    }
  }, [ aspect ])

  const boneClassName = cx(s.bone, s[`delay-${delay}`], className, {
    'relative': !/absolute/.test(className || ''),
    'rounded-4': !/rounded/.test(className || ''),
    [`text-${textSize}`]: textSize,
    'w-full': wFull,
  })

  if (textSize) {
    return (
      <div
        className={boneClassName}
        style={style}
        dangerouslySetInnerHTML={{ __html: Boolean(textSize) ? '&nbsp;' : '' }}
      />
    )
  }

  return (
    <div
      className={boneClassName}
      style={style}
    >
      {
        Boolean(placeholderStyle) && (
          <div style={placeholderStyle} />
        )
      }
      {children}
    </div>
  )
}


export default React.memo(Bone)
