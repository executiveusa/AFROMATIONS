import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Parse metadata
    const metadata = session.metadata || {}

    return NextResponse.json({
      id: session.id,
      customer_email: session.customer_email,
      total: session.amount_total,
      status: session.payment_status,
      print_service: metadata.printService,
      cart_items: metadata.cartItems ? JSON.parse(metadata.cartItems) : [],
      created_at: new Date(session.created * 1000),
    })
  } catch (error) {
    console.error('[v0] Failed to fetch order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
