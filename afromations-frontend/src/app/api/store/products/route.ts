import { NextResponse } from 'next/server'

// Mock products data for now - will integrate with Stripe/Supabase later
const MOCK_PRODUCTS = [
  { id: 1, name: 'Limited Edition Anime Print #1', price: 29, category: 'prints', image: 'print-1' },
  { id: 2, name: 'Collector\'s Character Sheet Set', price: 49, category: 'art', image: 'sheets' },
  { id: 3, name: 'AFROMATIONS Studio Hoodie', price: 59, category: 'apparel', image: 'hoodie' },
  { id: 4, name: 'Hana & DUAL Enamel Pin Set', price: 19, category: 'accessories', image: 'pins' },
  { id: 5, name: 'Anime Scene Storyboard Pack', price: 39, category: 'digital', image: 'storyboards' },
  { id: 6, name: 'Creator Starter Bundle', price: 99, category: 'bundles', image: 'bundle' },
]

export async function GET() {
  try {
    return NextResponse.json(MOCK_PRODUCTS)
  } catch (error) {
    console.error('[v0] Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
