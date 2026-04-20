import { Navbar } from '@/components/navbar'
import { HannaChat } from '@/components/hanna-chat'
import { ScrollReveal } from '@/components/scroll-reveal'

export function InnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <ScrollReveal />
      {children}
      <HannaChat />
    </>
  )
}
