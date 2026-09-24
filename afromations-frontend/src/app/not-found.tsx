import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-(--af-black) text-(--af-cream)">
      <Navbar />
      <section className="flex min-h-[78svh] items-center px-5 pb-20 pt-28 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-(--af-red) uppercase">404</p>
          <h1
            className="mt-5 max-w-5xl text-5xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-7xl lg:text-8xl"
            style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
          >
            This world isn’t here.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-(--af-grey-light)">
            The page may have moved, changed, or not been released yet. Go back to the work instead of hitting a dead end.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/work"
              className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
            >
              Explore the Work
            </Link>
            <Link
              href="/"
              className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
