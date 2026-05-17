'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'

export interface CartItem {
  id: string
  productId: string
  productName: string
  variantId?: string
  variantInfo: string
  quantity: number
  price: number
  image?: string
}

export function StoreCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [printService, setPrintService] = useState<'printify' | 'printful'>('printify')

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dual_cart')
    if (saved) {
      setCartItems(JSON.parse(saved))
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('dual_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const handleCheckout = async () => {
    if (!customerEmail || !customerName) {
      alert('Please enter your name and email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          customerEmail,
          customerName,
          shippingAddress: {
            name: customerName,
            email: customerEmail,
          },
          printService,
        }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      )
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-(--af-cream) mb-4">
            Your cart is empty
          </h2>
          <p className="text-(--af-grey-light) mb-8">
            Explore the DUAL Store and add some limited-edition merch
          </p>
          <a
            href="/store"
            className="af-btn-primary px-8 py-3 rounded-full font-semibold inline-block"
          >
            Continue Shopping
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-(--af-cream) mb-12">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-(--af-grey) rounded-lg border border-(--af-red) border-opacity-30 p-6 md:p-8">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="flex gap-4 pb-6 mb-6 border-b border-(--af-red) border-opacity-20 last:border-0 last:pb-0 last:mb-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-(--af-cream) mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-(--af-grey-light) mb-3">
                      {item.variantInfo}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-(--af-red) border-opacity-50 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-(--af-grey-light) hover:text-(--af-cream) transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-(--af-cream) min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-(--af-grey-light) hover:text-(--af-cream) transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-sm text-(--af-red) hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-(--af-red) text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-(--af-grey-light)">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-1">
            <div className="bg-(--af-grey) rounded-lg border border-(--af-red) border-opacity-30 p-6 sticky top-24">
              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b border-(--af-red) border-opacity-20">
                <h3 className="font-bold text-(--af-cream) mb-4">Your Info</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-(--af-black) text-(--af-cream) border border-(--af-red) border-opacity-50 rounded px-3 py-2 mb-3 focus:outline-none focus:border-(--af-red)"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-(--af-black) text-(--af-cream) border border-(--af-red) border-opacity-50 rounded px-3 py-2 focus:outline-none focus:border-(--af-red)"
                />
              </div>

              {/* Print Service Selection */}
              <div className="mb-6 pb-6 border-b border-(--af-red) border-opacity-20">
                <h3 className="font-bold text-(--af-cream) mb-4">
                  Print Service
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-(--af-black) transition-colors">
                    <input
                      type="radio"
                      name="printService"
                      value="printify"
                      checked={printService === 'printify'}
                      onChange={(e) =>
                        setPrintService(e.target.value as any)
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-(--af-cream)">Printify</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-(--af-black) transition-colors">
                    <input
                      type="radio"
                      name="printService"
                      value="printful"
                      checked={printService === 'printful'}
                      onChange={(e) =>
                        setPrintService(e.target.value as any)
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-(--af-cream)">Printful</span>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 mb-6 pb-6 border-b border-(--af-red) border-opacity-20">
                <div className="flex justify-between text-(--af-grey-light)">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-(--af-grey-light)">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-(--af-grey-light)">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-(--af-red)">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-(--af-red) text-lg pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={loading}
                className="w-full af-btn-primary py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </motion.button>

              <p className="text-xs text-(--af-grey-light) text-center mt-4">
                Powered by Stripe & Print Partners
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
