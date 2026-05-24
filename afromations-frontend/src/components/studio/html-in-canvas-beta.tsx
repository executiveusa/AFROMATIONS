'use client'

const ENABLE_HTML_IN_CANVAS_LAB =
  process.env.NEXT_PUBLIC_ENABLE_HTML_IN_CANVAS_LAB === 'true'

const useCases = [
  {
    title: 'Manga speech bubbles',
    body: 'Add dialogue, narration boxes, sound effects, and chapter labels over generated anime panels.',
  },
  {
    title: 'Anime subtitles',
    body: 'Place styled subtitles, Japanese learning notes, or translation cards directly over video scenes.',
  },
  {
    title: '3D world screens',
    body: 'Turn UI panels, posters, dashboards, and menus into surfaces inside future 3D anime environments.',
  },
  {
    title: 'Title cards and credits',
    body: 'Create opening cards, episode titles, character intros, and end credits with real typography.',
  },
  {
    title: 'Brand-safe exports',
    body: 'Add AFROMATIONS marks, creator handles, captions, and release labels to assets before export.',
  },
]

const demos = [
  {
    label: 'Manga Panel',
    caption: 'Speech bubbles and panel notes stay editable before export.',
    visual: 'manga',
  },
  {
    label: 'Scene Overlay',
    caption: 'Subtitles and learning notes can sit directly on top of video previews.',
    visual: 'overlay',
  },
  {
    label: 'World Surface',
    caption: 'Future 3D worlds can use designed HTML as in-world screens and signs.',
    visual: 'world',
  },
]

export function HtmlInCanvasBeta() {
  return (
    <section
      aria-labelledby="html-in-canvas-beta-title"
      className="px-6 sm:px-12 max-w-7xl mx-auto mt-16"
    >
      <div className="af-card">
        <div className="af-card-inner">
          {/* Eyebrow and warning pill */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6">
            <span
              className="text-[10px] font-medium tracking-[0.2em] uppercase"
              style={{ color: 'var(--af-teal)' }}
            >
              Beta Feature
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-semibold tracking-wider uppercase w-fit"
              style={{
                borderColor: 'var(--af-red)30',
                color: 'var(--af-red)',
              }}
            >
              <span className="inline-block h-1 w-1 rounded-full bg-current" aria-hidden="true" />
              Experimental
            </span>
          </div>

          {/* Title */}
          <h2
            id="html-in-canvas-beta-title"
            className="text-2xl font-bold text-(--af-cream) mb-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Canvas Layers
          </h2>

          {/* Plain-English description */}
          <p className="text-sm leading-relaxed text-(--af-grey-light) mb-6 max-w-2xl">
            Design captions, speech bubbles, posters, title cards, and interface layers that can sit inside your anime scenes.
          </p>

          {/* Beta warning callout */}
          <div
            className="rounded border px-4 py-3 mb-8 bg-white/2"
            style={{ borderColor: 'var(--af-red)20' }}
          >
            <p className="text-xs leading-relaxed text-(--af-grey-light)">
              <span style={{ color: 'var(--af-red)' }} className="font-semibold">
                Canvas Layers is experimental.
              </span>
              {' '}It may not work in every browser yet, and some demos require a browser flag. Use it for testing, previews, and creative experiments while we prepare it for production.
            </p>
          </div>

          {/* Explanation section */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-(--af-grey-light) mb-3">
              What is it
            </p>
            <p className="text-sm leading-relaxed text-(--af-grey-light) max-w-3xl">
              Most design tools make you choose between a webpage and a canvas. Canvas Layers lets Hana Studio place real designed elements — like subtitles, manga bubbles, posters, labels, buttons, and animated overlays — directly into the creative canvas. That means the things you design can become part of images, videos, or future 3D anime worlds.
            </p>
          </div>

          {/* Use cases grid */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-(--af-grey-light) mb-4">
              Use cases
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="rounded border border-white/5 bg-white/2 px-4 py-3"
                >
                  <p className="text-xs font-semibold text-(--af-cream) mb-2">
                    {useCase.title}
                  </p>
                  <p className="text-[10px] leading-relaxed text-(--af-grey-light)">
                    {useCase.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Static demo section */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-(--af-grey-light) mb-2">
              What this could look like
            </p>
            <p className="text-xs text-(--af-grey-light) mb-4 opacity-75">
              A preview of how designed layers could become part of scenes, panels, and future 3D worlds.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demos.map((demo) => (
                <div
                  key={demo.label}
                  className="rounded border border-white/5 overflow-hidden bg-white/1"
                >
                  {/* Demo visual placeholder */}
                  <div
                    className="aspect-square bg-gradient-to-br from-white/3 to-white/1 flex items-center justify-center relative overflow-hidden"
                    aria-hidden="true"
                  >
                    {demo.visual === 'manga' && (
                      <div className="space-y-2 w-full h-full p-4 flex flex-col justify-center">
                        <div className="bg-white/10 rounded-lg h-12" />
                        <div className="bg-[var(--af-red)] rounded-full h-16 w-20 self-center" style={{ opacity: 0.3 }} />
                        <div className="text-[8px] text-[var(--af-red)] font-bold self-center" style={{ opacity: 0.5 }}>
                          POW!
                        </div>
                      </div>
                    )}
                    {demo.visual === 'overlay' && (
                      <div className="space-y-3 w-full h-full p-4 flex flex-col justify-between">
                        <div className="bg-white/8 rounded h-24" />
                        <div
                          className="bg-white/20 rounded-sm h-6 w-full"
                          style={{ background: 'var(--af-cream)', opacity: 0.3 }}
                        />
                        <div className="text-[9px] text-(--af-cream) opacity-40">
                          日本語: meaning
                        </div>
                      </div>
                    )}
                    {demo.visual === 'world' && (
                      <div className="w-full h-full p-4 flex items-center justify-center perspective">
                        <div
                          className="border border-white/20 rounded h-20 w-32 flex items-center justify-center"
                          style={{
                            transform: 'perspective(600px) rotateY(-15deg) rotateX(5deg)',
                            background: 'var(--af-gold)',
                            opacity: 0.15,
                          }}
                        >
                          <div className="text-[10px] text-(--af-cream) font-semibold opacity-50">
                            UI Panel
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Demo label and caption */}
                  <div className="px-4 py-3 border-t border-white/5">
                    <p className="text-xs font-semibold text-(--af-cream) mb-1">
                      {demo.label}
                    </p>
                    <p className="text-[10px] leading-relaxed text-(--af-grey-light)">
                      {demo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical note */}
          <div
            className="rounded border px-4 py-3 mb-6 bg-white/1"
            style={{ borderColor: 'var(--af-teal)15' }}
          >
            <p className="text-xs leading-relaxed text-(--af-grey-light)">
              <span className="font-semibold" style={{ color: 'var(--af-teal)' }}>
                Technical note:
              </span>
              {' '}This lab is based on the HTML-in-Canvas proposal. The native browser API is still experimental, so Hana Studio will use normal previews first and only enable native canvas rendering behind a feature flag.
            </p>
          </div>

          {/* External demo button (conditional) */}
          {ENABLE_HTML_IN_CANVAS_LAB && (
            <div>
              <a
                href="https://html-in-canvas.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-full border border-white/10 px-5 text-xs font-semibold tracking-wider text-(--af-grey-light) hover:border-white/20 hover:text-(--af-cream) transition-colors"
                aria-label="Try experimental HTML-in-Canvas demo (opens external site)"
              >
                Try experimental demo →
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
