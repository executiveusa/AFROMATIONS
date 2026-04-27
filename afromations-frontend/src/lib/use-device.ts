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
    // iPadOS 13+ reports a "Macintosh" UA in desktop mode — detect via touch points.
    const isIos =
      /iphone|ipad|ipod/.test(ua) ||
      (/macintosh/.test(ua) && navigator.maxTouchPoints > 1)

    const mql = window.matchMedia('(max-width: 767px)')

    const update = () => {
      const isMobileWidth = mql.matches
      setInfo({
        platform: isAndroid ? 'android' : isIos ? 'ios' : 'desktop',
        isMobile: isAndroid || isIos || isMobileWidth,
        isTouch,
      })
    }

    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return info
}
