import { HeroSection } from '@/components/hero-section'
import { HannaFeature } from '@/components/hanna-feature'
import { StudioShowcase } from '@/components/studio-showcase'
import { BlogPreview } from '@/components/blog-preview'
import { CommunitySection } from '@/components/community-section'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HannaFeature />
      <StudioShowcase />
      <BlogPreview />
      <CommunitySection />
      <Footer />
    </main>
  )
}
