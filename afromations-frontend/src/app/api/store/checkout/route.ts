import { createPrintOrder } from '@/lib/print-services'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  try {
    const {
      cartItems,
      customerEmail,
      customerName,
      shippingAddress,
      printService,
    } = await request.json()

    // 1. Create Stripe checkout session
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productName,
          description: item.variantInfo,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/store/cart`,
      customer_email: customerEmail,
      metadata: {
        cartItems: JSON.stringify(cartItems),
        shippingAddress: JSON.stringify(shippingAddress),
        printService,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
