'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // Fetch order details from your backend
      fetch(`/api/store/order/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setOrderDetails(data)
          // Clear cart on successful purchase
          localStorage.removeItem('dual_cart')
        })
        .catch(err => console.log('[v0] Failed to fetch order:', err))
        .finally(() => setLoading(false))
    }
  }, [sessionId])

  return (
    <main className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-(--af-red) rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-(--af-cream)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-(--af-cream) mb-4">
          Order Confirmed!
        </h1>

        <p className="text-(--af-grey-light) mb-6">
          Thank you for your purchase. Your order is being prepared for printing and will ship soon.
        </p>

        {loading ? (
          <div className="text-(--af-grey-light) mb-6">Loading order details...</div>
        ) : orderDetails ? (
          <div className="bg-(--af-grey) border border-(--af-red) border-opacity-30 rounded-lg p-6 mb-6 text-left space-y-3">
            <div>
              <p className="text-(--af-grey-light) text-sm">Order ID</p>
              <p className="text-(--af-cream) font-bold">{sessionId?.slice(0, 12)}...</p>
            </div>
            <div>
              <p className="text-(--af-grey-light) text-sm">Email</p>
              <p className="text-(--af-cream)">{orderDetails.customer_email}</p>
            </div>
            {orderDetails.total && (
              <div>
                <p className="text-(--af-grey-light) text-sm">Total</p>
                <p className="text-(--af-red) font-bold text-lg">${(orderDetails.total / 100).toFixed(2)}</p>
              </div>
            )}
          </div>
        ) : null}

        <div className="space-y-3">
          <p className="text-(--af-grey-light) text-sm">
            Check your email for order confirmation and tracking details
          </p>
          
          <Link href="/store">
            <button className="w-full af-btn-primary py-3 rounded-lg font-semibold">
              Continue Shopping
            </button>
          </Link>

          <Link href="/">
            <button className="w-full border border-(--af-red) text-(--af-red) hover:bg-(--af-red) hover:text-(--af-cream) py-3 rounded-lg font-semibold transition-colors">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="mt-8 pt-8 border-t border-(--af-red) border-opacity-30">
          <h3 className="text-(--af-cream) font-bold mb-4">What&apos;s Next?</h3>
          <ul className="space-y-2 text-(--af-grey-light) text-sm text-left">
            <li className="flex items-start gap-3">
              <span className="text-(--af-red) mt-1">✓</span>
              <span>Your order is sent to {orderDetails?.print_service || 'our print partner'}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-(--af-red) mt-1">✓</span>
              <span>Quality check and production begins</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-(--af-red) mt-1">✓</span>
              <span>Item ships with tracking within 5-7 days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-(--af-red) mt-1">✓</span>
              <span>30% of profit goes to community programs</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
