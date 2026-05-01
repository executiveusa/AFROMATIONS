'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  images: string[]
}

interface StoreProductGridProps {
  products: Product[]
  isLoading?: boolean
}

export function StoreProductGrid({ products, isLoading }: StoreProductGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-neutral-900 h-96 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-400">No products available. Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/store/product/${product.id}`}
          className="group"
        >
          <div
            className="relative bg-(--af-grey) rounded-lg overflow-hidden border border-(--af-red) border-opacity-30 hover:border-opacity-100 transition-all cursor-pointer"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Product Image */}
            <div className="relative w-full aspect-square bg-(--af-grey) flex items-center justify-center">
              {product.images && product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-(--af-red) text-(--af-cream) px-3 py-1 rounded text-sm font-semibold">
                ${(product.price / 100).toFixed(2)}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="text-xs text-(--af-red) uppercase tracking-wider font-bold mb-2">
                {product.category}
              </div>
              <h3 className="text-(--af-cream) font-bold text-lg leading-tight mb-2 group-hover:text-(--af-red) transition-colors">
                {product.name}
              </h3>
              <p className="text-(--af-grey-light) text-sm line-clamp-2 mb-4">
                {product.description}
              </p>
              
              {/* CTA Button */}
              <button className="w-full af-btn-primary py-2 px-3 rounded text-sm font-semibold">
                View Details
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
