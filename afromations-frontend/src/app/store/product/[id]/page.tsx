import { StoreProductDetail } from '@/components/store-product-detail'
import { createClient } from '@/lib/supabase/server'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  // Fetch variants
  const { data: variants = [] } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', params.id)

  if (productError || !product) {
    return (
      <main className="min-h-screen bg-background pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-(--af-cream) mb-4">Product Not Found</h1>
          <p className="text-(--af-grey-light) mb-6">This product doesn&apos;t exist or has been removed.</p>
          <a href="/store" className="text-(--af-red) hover:underline font-semibold">
            Back to Store
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-(--af-grey-light) text-sm">
          <a href="/store" className="hover:text-(--af-red) transition-colors">Store</a>
          <span className="mx-2">/</span>
          <span className="text-(--af-red)">{product.name}</span>
        </div>

        <StoreProductDetail product={product} variants={variants} />
      </div>
    </main>
  )
}
