import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { StoreCart } from '@/components/store-cart'

export const metadata = {
  title: 'Shopping Cart | DUAL Store',
  description: 'Review your merchandise selections and proceed to checkout.',
}

export default function CartPage() {
  return (
    <main>
      <Navbar />
      <StoreCart />
      <Footer />
    </main>
  )
}
