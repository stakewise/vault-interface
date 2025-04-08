import React, { useLayoutEffect, useRef } from 'react'
import cx from 'classnames'
import { commonMessages } from 'helpers'

import { Text } from 'components'

import s from './ClaimLabel.module.scss'


type ClaimLabelProps = {
  className?: string
  amount: string
}

const ClaimLabel: React.FC<ClaimLabelProps> = (props) => {
  const { className, amount } = props

  const claimRef = useRef<HTMLElement>(null)
  const amountRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    let count = 0

    const claimWidth = Math.max((claimRef.current?.offsetWidth || 0) + 8, 40)
    const amountWidth = Math.max((amountRef.current?.offsetWidth || 0) + 8, 40)

    const parentNode = claimRef.current?.parentNode as HTMLDivElement
    parentNode?.style.setProperty('width', `${claimWidth}px`)

    const interval = setInterval(() => {
      if (claimRef.current && amountRef.current) {
        if (count % 2) {
          claimRef.current.classList.remove('opacity-0')
          amountRef.current.classList.add('opacity-0')
          parentNode?.style.setProperty('width', `${claimWidth}px`)
        }
        else {
          claimRef.current.classList.add('opacity-0')
          amountRef.current.classList.remove('opacity-0')
          parentNode?.style.setProperty('width', `${amountWidth}px`)
        }

        count += 1
      }
    }, 4500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      className={cx(
        className,
        s.box,
        'flex flex-col items-center justify-center bg-success uppercase rounded-6 pointer-events-none h-12'
      )}
    >
      <Text
        ref={claimRef}
        className={s.text}
        message={commonMessages.buttonTitle.claim}
        color="light"
        size="n10b"
      />
      <Text
        ref={amountRef}
        className={cx(s.text, 'opacity-0')}
        message={amount}
        color="light"
        size="n10b"
      />
    </div>
  )
}


export default React.memo(ClaimLabel)
