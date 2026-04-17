'use client'

interface MasteryRingProps {
  domain: string
  score: number // 0-100
  level: string // n5, n4, n3, n2, n1, advanced, expert
  trend?: number // -10 to +10, direction of change
  size?: 'sm' | 'md' | 'lg'
}

const levelColors: Record<string, { ring: string; text: string }> = {
  n5: { ring: '#3b82f6', text: 'text-blue-400' },
  n4: { ring: '#06b6d4', text: 'text-cyan-400' },
  n3: { ring: '#10b981', text: 'text-green-400' },
  n2: { ring: '#eab308', text: 'text-yellow-400' },
  n1: { ring: '#f97316', text: 'text-orange-400' },
  advanced: { ring: '#ef4444', text: 'text-red-400' },
  expert: { ring: '#d4a017', text: 'text-yellow-500' },
}

const sizeMap = {
  sm: { radius: 40, circumference: 251, textSize: 'text-lg' },
  md: { radius: 60, circumference: 377, textSize: 'text-3xl' },
  lg: { radius: 80, circumference: 503, textSize: 'text-5xl' },
}

export function MasteryRing({
  domain,
  score,
  level,
  trend,
  size = 'md',
}: MasteryRingProps) {
  const config = sizeMap[size]
  const colors = levelColors[level] || levelColors.n5

  // Calculate stroke offset (progress = score/100)
  const offset = config.circumference - (score / 100) * config.circumference

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG Ring */}
      <div className="relative">
        <svg
          width={config.radius * 2}
          height={config.radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius}
            cy={config.radius}
            r={config.radius - 8}
            fill="none"
            stroke="rgb(42, 42, 42)"
            strokeWidth="4"
          />

          {/* Progress circle */}
          <circle
            cx={config.radius}
            cy={config.radius}
            r={config.radius - 8}
            fill="none"
            stroke={colors.ring}
            strokeWidth="4"
            strokeDasharray={config.circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${config.textSize} font-bold text-[var(--af-cream)]`}>
            {Math.round(score)}
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
            {level}
          </div>
        </div>
      </div>

      {/* Domain label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--af-cream)] capitalize">
          {domain.replace(/_/g, ' ')}
        </p>

        {/* Trend indicator */}
        {trend !== undefined && trend !== 0 && (
          <p
            className={`text-xs mt-1 ${
              trend > 0 ? 'text-green-400' : 'text-orange-400'
            }`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)} this week
          </p>
        )}
      </div>
    </div>
  )
}

interface MasteryGridProps {
  mastery: Array<{
    domain: string
    score: number
    level: string
    trend?: number
  }>
  size?: 'sm' | 'md' | 'lg'
}

export function MasteryGrid({ mastery, size = 'md' }: MasteryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {mastery.map((item) => (
        <MasteryRing
          key={item.domain}
          domain={item.domain}
          score={item.score}
          level={item.level}
          trend={item.trend}
          size={size}
        />
      ))}
    </div>
  )
}
