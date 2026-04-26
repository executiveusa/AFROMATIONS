'use client'

import { useEffect, useState } from 'react'

type Platform = 'android' | 'ios' | 'desktop' | 'unknown'

interface DeviceInfo {
  platform: Platform
  isMobile: boolean
  isTouch: boolean
}

export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>({
    platform: 'unknown',
    isMobile: false,
    isTouch: false,
  })

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    const isTouch = navigator.maxTouchPoints > 0
    const isAndroid = /android/.test(ua)
    const isIos = /iphone|ipad|ipod/.test(ua)
    const isMobileWidth = window.matchMedia('(max-width: 767px)').matches

    setInfo({
      platform: isAndroid ? 'android' : isIos ? 'ios' : isMobileWidth ? 'desktop' : 'desktop',
      isMobile: isAndroid || isIos || isMobileWidth,
      isTouch,
    })
  }, [])

  return info
}
