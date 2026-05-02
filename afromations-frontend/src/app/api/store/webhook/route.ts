import { createPrintOrder } from '@/lib/print-services'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Handle Stripe webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')!

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Extract order data from metadata
      const cartItems = JSON.parse(session.metadata?.cartItems || '[]')
      const shippingAddress = JSON.parse(session.metadata?.shippingAddress || '{}')
      const printService = session.metadata?.printService || 'printify'

      // 1. Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_order_id: session.id,
          customer_email: session.customer_email,
          customer_name: shippingAddress.name,
          total_amount: (session.amount_total || 0) / 100,
          status: 'confirmed',
          shipping_address: shippingAddress,
        })
        .select()
        .single()

      if (orderError) {
        console.error('[v0] Order creation failed:', orderError)
        throw orderError
      }

      // 2. Create order items
      const orderItems = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
        price_paid: item.price,
      }))

      await supabase.from('order_items').insert(orderItems)

      // 3. Send to print-on-demand service
      try {
        const podOrder = await createPrintOrder(printService as any, {
          externalId: order.id,
          lineItems: cartItems.map((item: any) => ({
            productId: item.printifyId || item.printfulId,
            variantId: item.variantPrintId,
            quantity: item.quantity,
          })),
          shippingAddress,
          shipping: 'standard',
        })

        // Update order with POD details
        await supabase
          .from('orders')
          .update({
            [`${printService}_order_id`]: podOrder.id,
            fulfillment_status: 'submitted_to_print',
          })
          .eq('id', order.id)
      } catch (podError) {
        console.error('[v0] Print order failed:', podError)
        // Log but don't fail - manual processing can occur
        await supabase
          .from('orders')
          .update({ fulfillment_status: 'manual_review_required' })
          .eq('id', order.id)
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    )
  }
}
