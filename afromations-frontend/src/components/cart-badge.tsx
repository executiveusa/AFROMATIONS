'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CartBadge() {
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load initial cart count
    const updateCount = () => {
      const saved = localStorage.getItem('dual_cart')
      if (saved) {
        try {
          const items = JSON.parse(saved)
          const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
          setCartCount(total)
        } catch {
          setCartCount(0)
        }
      }
    }

    updateCount()

    // Listen for storage changes
    const handleStorageChange = () => updateCount()
    window.addEventListener('storage', handleStorageChange)

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!mounted) return null

  return (
    <Link href="/store/cart" className="relative">
      <svg
        className="w-6 h-6 text-(--af-cream) hover:text-(--af-red) transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-(--af-red) text-(--af-cream) text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  )
}
