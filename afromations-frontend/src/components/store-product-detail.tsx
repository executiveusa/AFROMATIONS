'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'

interface ProductVariant {
  id: string
  size?: string
  color?: string
}

interface ProductDetailProps {
  product: {
    id: string
    name: string
    description: string
    category: string
    price: number
    cost: number
    images: string[]
    print_provider: string
    print_provider_sku: string
  }
  variants: ProductVariant[]
}

export function StoreProductDetail({ product, variants }: ProductDetailProps) {
  const { addToCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addedMessage, setAddedMessage] = useState(false)

  // Group variants by attribute
  const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)))
  const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)))

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart({
        product_id: product.id,
        product_name: product.name,
        variant_id: selectedVariant?.id,
        quantity,
        price: product.price,
      })
      setAddedMessage(true)
      setTimeout(() => setAddedMessage(false), 2000)
    } finally {
      setIsAdding(false)
    }
  }

  const markup = ((product.price - product.cost) / product.cost * 100).toFixed(0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="space-y-4">
        <div className="relative w-full aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
          {product.images && product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-3 gap-2">
            {product.images.slice(0, 3).map((img, i) => (
              <div key={i} className="relative aspect-square bg-neutral-900 rounded border border-neutral-800">
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="text-sm text-red-500 uppercase tracking-wider font-bold mb-2">
            {product.category}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-neutral-300 leading-relaxed mb-4">{product.description}</p>
          
          {/* Price & Sustainability Note */}
          <div className="flex items-baseline gap-4 mb-6">
            <div className="text-3xl font-bold text-red-500">
              ${(product.price / 100).toFixed(2)}
            </div>
            <div className="text-xs text-neutral-500">
              Markup: {markup}% | Cost: ${(product.cost / 100).toFixed(2)}
            </div>
          </div>

          {/* Print Provider */}
          <div className="text-sm text-neutral-400">
            Printed by: <span className="font-semibold text-white">{product.print_provider === 'printify' ? 'Printify' : 'Printful'}</span>
          </div>
        </div>

        {/* Variants Selection */}
        {(sizes.length > 0 || colors.length > 0) && (
          <div className="space-y-4 border-t border-neutral-800 pt-6">
            {sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const variant = variants.find(v => v.size === size)
                        if (variant) setSelectedVariant(variant)
                      }}
                      className={`py-2 px-3 text-sm font-semibold rounded transition-colors ${
                        selectedVariant?.size === size
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-red-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const variant = variants.find(v => v.color === color)
                        if (variant) setSelectedVariant(variant)
                      }}
                      className={`py-2 px-3 text-sm font-semibold rounded transition-colors ${
                        selectedVariant?.color === color
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-red-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="space-y-4 border-t border-neutral-800 pt-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-neutral-900 text-white w-10 h-10 rounded flex items-center justify-center border border-neutral-800 hover:border-red-600"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 bg-neutral-900 text-white text-center py-2 px-3 rounded border border-neutral-800"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-neutral-900 text-white w-10 h-10 rounded flex items-center justify-center border border-neutral-800 hover:border-red-600"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 px-4 rounded font-bold text-lg transition-colors"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>

          {addedMessage && (
            <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-2 rounded text-sm text-center">
              Added to cart!
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-red-500 mt-1">✓</span>
            <span className="text-sm text-neutral-300"><strong>Profits Support Mission</strong> - 30% of profit goes to youth programs and open-source tools</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-500 mt-1">✓</span>
            <span className="text-sm text-neutral-300"><strong>Print-on-Demand</strong> - Zero inventory waste, produced only when ordered</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-500 mt-1">✓</span>
            <span className="text-sm text-neutral-300"><strong>Token Holder Discount</strong> - 10% off for DUAL community members</span>
          </div>
        </div>
      </div>
    </div>
  )
}
