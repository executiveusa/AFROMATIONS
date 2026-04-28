import { HeroSection } from '@/components/hero-section'
import { HannaFeature } from '@/components/hanna-feature'
import { StudioShowcase } from '@/components/studio-showcase'
import { GallerySection } from '@/components/gallery-section'
import { AnimeQuoteCarousel } from '@/components/anime-quote-carousel'
import { EducationSection } from '@/components/education-section'
import { BlogPreview } from '@/components/blog-preview'
import { CommunitySection } from '@/components/community-section'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { HannaChat } from '@/components/hanna-chat'
import { CinematicIntro } from '@/components/cinematic-intro'
import { KineticMarquee } from '@/components/kinetic-marquee'

const MARQUEE_WORDS = [
  'AFROMATIONS',
  'DUO',
  'Anime',
  'Culture',
  'Create',
  '花',
  'Studio',
  'Spirit',
]

export default function Home() {
  return (
    <main>
      <CinematicIntro />
      <Navbar />
      <HeroSection />
      <KineticMarquee items={MARQUEE_WORDS} speed={75} className="border-t border-white/5 py-10" />
      <HannaFeature />
      <StudioShowcase />
      <KineticMarquee items={MARQUEE_WORDS} speed={60} reverse className="border-t border-white/5 py-8" />
      <GallerySection />
      <AnimeQuoteCarousel />
      <EducationSection />
      <BlogPreview />
      <CommunitySection />
      <Footer />
      <HannaChat />
    </main>
  )
}
