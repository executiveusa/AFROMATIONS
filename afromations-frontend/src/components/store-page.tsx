'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { InView } from './motion/in-view'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image_url: string
  description: string
}

const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'phone-cases', name: 'Phone Cases' },
  { id: 'hoodies', name: 'Hoodies' },
  { id: 'tees', name: 'Tees' },
  { id: 'posters', name: 'Posters' },
  { id: 'canvas', name: 'Canvas' },
  { id: 'hats', name: 'Hats' },
  { id: 'stickers', name: 'Stickers' },
  { id: 'digital', name: 'Digital' },
]

export function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/store/products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('[v0] Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = 
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <section className="min-h-screen bg-background pt-20 pb-20">
      {/* Header */}
      <InView
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6 }}
        once
        className="mb-16 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-(--af-cream) mb-4">
          DUAL Store
        </h1>
        <p className="text-lg md:text-xl text-(--af-grey-light) max-w-2xl mx-auto">
          Premium merchandise from the DUAL universe. Limited editions. Built to last.
        </p>
      </InView>

      {/* Category Filter */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, delay: 0.1 }}
        once
        className="mb-16"
      >
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-(--af-red) text-(--af-cream)'
                  : 'border border-(--af-red) text-(--af-red) hover:bg-(--af-red) hover:text-(--af-cream)'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </InView>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center text-(--af-grey-light) py-20">
          Loading merchandise...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
          {filteredProducts.map((product, i) => (
            <InView
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              once
              className="group"
            >
              <div className="bg-(--af-grey) rounded-lg overflow-hidden border border-(--af-red) border-opacity-30 hover:border-opacity-100 transition-all cursor-pointer">
                {/* Product Image */}
                <div className="relative h-64 md:h-72 overflow-hidden bg-(--af-grey) flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-(--af-grey) to-(--af-grey-light) flex items-center justify-center">
                      <span className="text-(--af-grey-light)">No image</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <p className="text-(--af-red) text-sm font-bold uppercase mb-2">
                    {product.category}
                  </p>
                  <h3 className="text-xl font-bold text-(--af-cream) mb-2">
                    {product.name}
                  </h3>
                  <p className="text-(--af-grey-light) text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-(--af-red)">
                      ${product.price.toFixed(2)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="af-btn-primary px-4 py-2 text-sm font-semibold"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </InView>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-(--af-grey-light) text-lg mb-4">
            No products in this category yet.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-(--af-red) hover:underline font-semibold"
          >
            View all items
          </button>
        </div>
      )}

      {/* Trust Badges */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, delay: 0.2 }}
        once
        className="mt-20 pt-20 border-t border-(--af-red) border-opacity-30"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 text-center">
          <div>
            <p className="text-(--af-red) font-bold mb-2">Print on Demand</p>
            <p className="text-(--af-grey-light) text-sm">
              Made to order with Printify & Printful
            </p>
          </div>
          <div>
            <p className="text-(--af-red) font-bold mb-2">Worldwide Shipping</p>
            <p className="text-(--af-grey-light) text-sm">
              Fast, tracked delivery to your door
            </p>
          </div>
          <div>
            <p className="text-(--af-red) font-bold mb-2">Premium Quality</p>
            <p className="text-(--af-grey-light) text-sm">
              High-quality materials built to last
            </p>
          </div>
          <div>
            <p className="text-(--af-red) font-bold mb-2">Limited Editions</p>
            <p className="text-(--af-grey-light) text-sm">
              Exclusive drops. Once it&apos;s gone, it&apos;s gone
            </p>
          </div>
        </div>
      </InView>
    </section>
  )
}
