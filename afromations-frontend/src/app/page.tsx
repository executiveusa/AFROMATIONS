import { HeroSection } from '@/components/hero-section'
import { HannaFeature } from '@/components/hanna-feature'
import { StudioShowcase } from '@/components/studio-showcase'
import { GallerySection } from '@/components/gallery-section'
import { EducationSection } from '@/components/education-section'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { HannaChat } from '@/components/hanna-chat'
import { KineticMarquee } from '@/components/kinetic-marquee'

const MARQUEE_WORDS = [
  'AFROMATIONS',
  'Anime',
  'Culture',
  'Create',
  '花',
  'Studio',
  'Spirit',
  'Academy',
]

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <KineticMarquee items={MARQUEE_WORDS} speed={75} className="border-t border-white/5 py-10" />
      <HannaFeature />
      <StudioShowcase />
      <GallerySection />
      <EducationSection />
      <Footer />
      <HannaChat />
    </main>
  )
}
