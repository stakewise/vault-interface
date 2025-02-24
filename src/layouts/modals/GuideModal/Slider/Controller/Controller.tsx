import React, { useEffect } from 'react'
import { useSwiper } from 'swiper/react'


const Controller: React.FC = () => {
  const swiper = useSwiper()

  useEffect(() => {
    swiper?.update()

    return () => {
      swiper?.destroy()
    }
  }, [ swiper ])

  return null
}


export default React.memo(Controller)
