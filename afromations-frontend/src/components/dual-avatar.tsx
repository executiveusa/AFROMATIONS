'use client'

/**
 * DUAL Agent Avatar
 * A stylized SVG avatar representing DUAL - the protagonist of Seattle 2056.
 * Features the iconic blindfold, dreadlocks, and piercing golden eyes.
 */
export function DualAvatar({ 
  size = 120, 
  className = '' 
}: { 
  size?: number
  className?: string 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DUAL Agent Avatar"
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#1a1a1a" stroke="#C41E3A" strokeWidth="2" />
      
      {/* Inner glow ring */}
      <circle cx="60" cy="60" r="52" fill="none" stroke="#C41E3A" strokeWidth="0.5" opacity="0.3" />
      
      {/* Face silhouette */}
      <ellipse cx="60" cy="62" rx="28" ry="32" fill="#2a2a2a" />
      
      {/* Dreadlocks - left side */}
      <path d="M32 45 Q28 55 30 70 Q32 85 28 95" stroke="#3d3d3d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M36 42 Q30 52 32 67 Q34 82 30 92" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M40 40 Q34 50 36 65 Q38 80 34 90" stroke="#3d3d3d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M44 38 Q38 48 40 63 Q42 78 38 88" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Dreadlocks - right side */}
      <path d="M88 45 Q92 55 90 70 Q88 85 92 95" stroke="#3d3d3d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M84 42 Q90 52 88 67 Q86 82 90 92" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M80 40 Q86 50 84 65 Q82 80 86 90" stroke="#3d3d3d" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M76 38 Q82 48 80 63 Q78 78 82 88" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Dreadlocks - top/back */}
      <path d="M48 36 Q44 42 46 55" stroke="#3d3d3d" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M52 34 Q48 40 50 52" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M68 34 Q72 40 70 52" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M72 36 Q76 42 74 55" stroke="#3d3d3d" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Blindfold */}
      <rect x="32" y="52" width="56" height="12" rx="2" fill="#1a3a4a" />
      <rect x="32" y="52" width="56" height="12" rx="2" fill="url(#blindfold-gradient)" />
      
      {/* Blindfold knot - right side */}
      <path d="M88 58 L96 54 Q100 58 96 62 L88 58" fill="#1a3a4a" />
      
      {/* Eyes behind blindfold - glowing golden */}
      <ellipse cx="48" cy="58" rx="6" ry="4" fill="#D4A017" opacity="0.9" />
      <ellipse cx="72" cy="58" rx="6" ry="4" fill="#D4A017" opacity="0.9" />
      
      {/* Eye glow effect */}
      <ellipse cx="48" cy="58" rx="8" ry="5" fill="#D4A017" opacity="0.3" />
      <ellipse cx="72" cy="58" rx="8" ry="5" fill="#D4A017" opacity="0.3" />
      
      {/* Eye pupils */}
      <ellipse cx="48" cy="58" rx="2" ry="2" fill="#000" />
      <ellipse cx="72" cy="58" rx="2" ry="2" fill="#000" />
      
      {/* Nose hint */}
      <path d="M60 66 L58 74 Q60 76 62 74 L60 66" fill="#3a3a3a" />
      
      {/* Mouth/mask area */}
      <path d="M48 80 Q60 86 72 80" stroke="#3a3a3a" strokeWidth="1" fill="none" />
      
      {/* Neck/collar */}
      <path d="M50 90 L50 100 Q60 105 70 100 L70 90" fill="#2a2a2a" />
      
      {/* O.W.P.I.L symbol - red flower/rose */}
      <g transform="translate(52, 98)">
        <circle cx="8" cy="8" r="6" fill="#C41E3A" opacity="0.9" />
        <circle cx="8" cy="2" r="3" fill="#C41E3A" />
        <circle cx="14" cy="5" r="3" fill="#C41E3A" />
        <circle cx="14" cy="11" r="3" fill="#C41E3A" />
        <circle cx="8" cy="14" r="3" fill="#C41E3A" />
        <circle cx="2" cy="11" r="3" fill="#C41E3A" />
        <circle cx="2" cy="5" r="3" fill="#C41E3A" />
        <circle cx="8" cy="8" r="3" fill="#8B0000" />
      </g>
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="blindfold-gradient" x1="32" y1="52" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a4a5a" />
          <stop offset="100%" stopColor="#1a3a4a" />
        </linearGradient>
        
        <radialGradient id="eye-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#D4A017" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
