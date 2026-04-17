'use client'

interface JapaneseTextProps {
  japanese: string
  furigana?: string // optional ruby annotation
  english?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
  xl: 'text-4xl',
}

export function JapaneseText({
  japanese,
  furigana,
  english,
  className = '',
  size = 'md',
}: JapaneseTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Japanese with optional furigana */}
      <div className={`${sizeClasses[size]} font-semibold text-[var(--af-cream)] tracking-tight`}>
        {furigana ? (
          <ruby className="font-sans">
            {japanese}
            <rt className={`text-[${size === 'xl' ? '0.4' : size === 'lg' ? '0.45' : '0.5'}em`}>
              {furigana}
            </rt>
          </ruby>
        ) : (
          japanese
        )}
      </div>

      {/* English translation underneath */}
      {english && (
        <p className="text-[var(--af-grey-light)] text-sm leading-relaxed">
          {english}
        </p>
      )}
    </div>
  )
}

interface JapaneseBlockProps {
  items: Array<{
    japanese: string
    furigana?: string
    english?: string
  }>
  className?: string
}

export function JapaneseBlock({ items, className = '' }: JapaneseBlockProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, i) => (
        <JapaneseText
          key={i}
          japanese={item.japanese}
          furigana={item.furigana}
          english={item.english}
        />
      ))}
    </div>
  )
}
