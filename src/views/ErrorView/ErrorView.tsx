'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { links } from 'helpers'
import Image from 'next/image'

import { Text, Button } from 'components'

import messages from './messages'


type ErrorViewProps = {
  error: Error
}

const ErrorView: React.FC<ErrorViewProps> = ({ error }) => {
  const { push } = useRouter()

  const pageMessages = error ? messages.error : messages.notFound

  return (
    <div className="width-container flex-1 flex">
      <div className="flex flex-col items-center justify-center m-auto">
        <Text
          className="mt-64 text-center"
          message={pageMessages.title}
          color="p600"
          size="6xl"
        />
        <Text
          className="mt-20 text-center max-w-[320rem]"
          message={pageMessages.text}
          color="p900"
          size="lg"
        />
        <Button
          className="mt-64"
          bgColor="primary"
          title={messages.buttonTitle}
          size="md"
          onClick={() => push(links.home)}
        />
      </div>
    </div>
  )
}


export default ErrorView
