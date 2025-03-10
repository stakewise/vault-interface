'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { links } from 'helpers'

import { Text, Button } from 'components'

import messages from './messages'


type ErrorViewProps = {
  error: Error
  reset: () => void
}

const ErrorView: React.FC<ErrorViewProps> = ({ error, reset }) => {
  const { push } = useRouter()

  const pageMessages = error ? messages.error : messages.notFound

  return (
    <div className="width-container flex-1 flex">
      <div className="flex flex-col items-center justify-center m-auto">
        <Text
          className="text-center"
          message={pageMessages.title}
          color="dark"
          size="h32"
        />
        <Text
          className="mt-16 text-center"
          message={pageMessages.text}
          color="dark"
          size="t14"
        />
        <Button
          className="mt-32"
          dataTestId="error-back-button"
          title={messages.buttonTitle}
          onClick={() => {
            reset()
            push(links.home)
          }}
        />
      </div>
    </div>
  )
}


export default ErrorView
