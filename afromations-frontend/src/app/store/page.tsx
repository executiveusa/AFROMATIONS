import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { StorePage } from '@/components/store-page'

export const metadata = {
  title: 'DUAL Merch Store | AFROMATIONS',
  description: 'Premium merchandise from the DUAL universe. Limited editions, print-on-demand quality.',
}

export default function Store() {
  return (
    <main>
      <Navbar />
      <StorePage />
      <Footer />
    </main>
  )
}
