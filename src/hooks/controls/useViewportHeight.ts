'use client'
import { useEffect } from 'react'
import device from 'modules/device'

/*

  Usage:

  // Scss
  @include media-mobile {

    .container {
      @include viewportHeight(min-height, 100);

      // viewportHeight mixin add styles:
      // min-height: 100vh;
      // min-height: calc(var(--vh, 1vh) * 100);
    }
  }

  // Component
  const Page = () => {
    useViewportHeight()

    return (
      <div className={s.container}>
        Full height content on mobile
      <div>
    )
  }

  Mobile browsers include bottom bar (about 60px) to 100vh.
  The hook is used to fill viewport height on 100% without bottom bar.
  It sets property `--vh` to the body that is equal to 1% of the viewport height.
  If browser doesn't support custom css properties, there is a fallback to 100vh
  and the logic will be as usual.
 */

const useViewportHeight = () => {
  const { isMobile } = device.useData()

  useEffect(() => {
    if (isMobile) {
      const handler = () => {
        const vh = window.innerHeight  * 0.01

        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }

      handler()
      window.addEventListener('resize', handler)

      return () => {
        window.removeEventListener('resize', handler)
        document.documentElement.style.removeProperty('--vh')
      }
    }
  }, [ isMobile ])
}


export default useViewportHeight
