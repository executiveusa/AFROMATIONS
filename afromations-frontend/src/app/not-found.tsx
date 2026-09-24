import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="flex min-h-[78svh] items-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-(--af-red) uppercase">404</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl" style={{fontFamily:'Sora, sans-serif',textWrap:'balance'}}>
            This page is not part of the world.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-(--af-grey-light)">The route may have moved, or the project is not public yet.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Home</Link>
            <Link href="/work" className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold">Explore Work</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
