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

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HannaFeature />
      <StudioShowcase />
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
