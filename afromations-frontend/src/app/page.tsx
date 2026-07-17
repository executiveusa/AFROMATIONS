import { HeroSection } from '@/components/hero-section'
import { ArtistSovereigntySection } from '@/components/artist-sovereignty-section'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ArtistSovereigntySection />
      <Footer />
    </main>
  )
}
