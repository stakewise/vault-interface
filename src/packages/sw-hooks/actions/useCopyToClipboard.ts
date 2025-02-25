import { useCallback } from 'react'
import notifications from 'sw-modules/notifications'

import messages from './messages'


const useCopyToClipboard = () => {
  const fallbackCopyToClipboard = useCallback((text: string) => {
    const textArea = document.createElement('textarea')

    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)

    textArea.focus()
    textArea.select()

    let isCopied

    try {
      isCopied = document.execCommand('copy')
    }
    catch (error) {
      console.error('Unable to copy', error)
      isCopied = false
    }

    document.body.removeChild(textArea)

    return isCopied
  }, [])

  const handleCopyToClipboard = useCallback(async (text: string) => {
    if (!navigator.clipboard) {
      return fallbackCopyToClipboard(text)
    }

    await navigator.clipboard.writeText(text)

    return true
  }, [ fallbackCopyToClipboard ])

  return useCallback(async (text: string) => {
    const isCopied = await handleCopyToClipboard(text)

    notifications.open({
      type: 'info',
      text: messages.copiedToClipboard,
    })

    return isCopied
  }, [ handleCopyToClipboard ])
}


export default useCopyToClipboard
