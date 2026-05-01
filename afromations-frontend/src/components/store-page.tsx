'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { InView } from './motion/in-view'
import { StoreProductGrid } from './store-product-grid'

interface Product {
  id: string
  name: string
  category: string
  price: number
  images: string[]
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
  { id: 'bundles', name: 'Bundles' },
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
        console.log('[v0] Failed to fetch products:', error)
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
        className="mb-16 text-center px-4 max-w-4xl mx-auto"
      >
        <div className="text-(--af-red) text-sm uppercase tracking-widest font-bold mb-4">
          O.W.P.I.L Universe Merchandise
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-(--af-cream) mb-4">
          DUAL Store
        </h1>
        <p className="text-lg md:text-xl text-(--af-grey-light) max-w-2xl mx-auto leading-relaxed mb-8">
          Premium collector items from the O.W.P.I.L universe. Limited drops, museum-quality materials, profit-sharing with creators. Every purchase supports our mission to teach anime production and build community.
        </p>
        
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="border-l-2 border-(--af-red) pl-4 text-left">
            <div className="font-bold text-(--af-cream)">Premium Quality</div>
            <div className="text-(--af-grey-light) text-sm">Museum-grade materials, archival inks</div>
          </div>
          <div className="border-l-2 border-(--af-red) pl-4 text-left">
            <div className="font-bold text-(--af-cream)">Zero Inventory Waste</div>
            <div className="text-(--af-grey-light) text-sm">Print-on-demand only via Printify & Printful</div>
          </div>
          <div className="border-l-2 border-(--af-red) pl-4 text-left">
            <div className="font-bold text-(--af-cream)">Mission-Aligned</div>
            <div className="text-(--af-grey-light) text-sm">30% of profit to youth programs</div>
          </div>
        </div>
      </InView>

      {/* Category Filter */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, delay: 0.1 }}
        once
        className="mb-16 border-t border-(--af-red) border-opacity-30 pt-8"
      >
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-sm font-semibold transition-all rounded ${
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
      <div className="px-4 max-w-7xl mx-auto mb-20">
        <StoreProductGrid products={filteredProducts} isLoading={loading} />
        
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
      </div>

      {/* Community CTA */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, delay: 0.2 }}
        once
        className="bg-(--af-grey) border border-(--af-red) border-opacity-50 rounded-lg p-8 md:p-12 text-center max-w-2xl mx-auto mb-20 px-4"
      >
        <div className="text-(--af-red) text-sm uppercase tracking-widest font-bold mb-2">
          Join the Community
        </div>
        <h2 className="text-3xl font-bold text-(--af-cream) mb-4">
          Token Holders Get 10% Off
        </h2>
        <p className="text-(--af-grey-light) mb-6 max-w-md mx-auto">
          Hold DUAL community tokens for exclusive discounts, early access to limited drops, and voting rights on future merchandise and initiatives.
        </p>
        <Link href="#community">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="af-btn-primary px-8 py-3 font-semibold"
          >
            Learn About DUAL Tokens
          </motion.button>
        </Link>
      </InView>

      {/* Trust Badges */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, delay: 0.3 }}
        once
        className="pt-12 border-t border-(--af-red) border-opacity-30"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto px-4 text-center">
          <div>
            <p className="text-(--af-red) font-bold mb-2">Print on Demand</p>
            <p className="text-(--af-grey-light) text-sm">
              Made to order with Printify & Printful
            </p>
          </div>
          <div>
            <p className="text-(--af-red) font-bold mb-2">Worldwide Shipping</p>
            <p className="text-(--af-grey-light) text-sm">
              Fast, tracked delivery worldwide
            </p>
          </div>
          <div>
            <p className="text-(--af-red) font-bold mb-2">Premium Quality</p>
            <p className="text-(--af-grey-light) text-sm">
              High-quality materials built to last
            </p>
          </div>
          <div>
            <p className="text-(--af-red) font-bold mb-2">Sustainable</p>
            <p className="text-(--af-grey-light) text-sm">
              Zero inventory waste, mission-driven
            </p>
          </div>
        </div>
      </InView>
    </section>
  )
}
