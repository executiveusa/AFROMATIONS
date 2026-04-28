'use client'

import { motion, useInView, type Variants, type Transition } from 'motion/react'
import { useRef } from 'react'

type Preset = 'blur-sm' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'
type Per = 'word' | 'char' | 'line'

interface TextEffectProps {
  children: string
  per?: Per
  as?: keyof React.JSX.IntrinsicElements
  variants?: { container?: Variants; item?: Variants }
  className?: string
  preset?: Preset
  delay?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  speedReveal?: number
  speedSegment?: number
  style?: React.CSSProperties
  once?: boolean
}

const presetVariants: Record<Preset, { container: Variants; item: Variants }> = {
  'blur-sm': {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.03 } } },
    item: {
      hidden: { opacity: 0, filter: 'blur(8px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
  'fade-in-blur': {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: {
      hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
  },
  scale: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: {
      hidden: { opacity: 0, scale: 0.6 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  fade: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  },
  slide: {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
    item: {
      hidden: { opacity: 0, x: -24 },
      visible: { opacity: 1, x: 0 },
    },
  },
}

function splitSegments(text: string, per: Per): string[] {
  if (per === 'char') return text.split('')
  if (per === 'line') return text.split('\n')
  return text.split(' ')
}

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  trigger = true,
  onAnimationComplete,
  speedReveal = 1,
  speedSegment = 1,
  style,
  once = true,
}: TextEffectProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once })

  const chosen = presetVariants[preset]
  const containerV: Variants = variants?.container ?? {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04 / speedReveal,
        delayChildren: delay,
        ...((chosen.container.visible as { transition?: Transition })?.transition ?? {}),
      },
    },
  }
  const itemV: Variants = variants?.item ?? {
    ...chosen.item,
    visible: {
      ...(chosen.item.visible as object),
      transition: {
        duration: 0.45 / speedSegment,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const segments = splitSegments(children, per)
  const Tag = as
  const MotionTag = motion.create(Tag as keyof HTMLElementTagNameMap)

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={trigger && inView ? 'visible' : 'hidden'}
      variants={containerV}
      className={className}
      style={style}
      onAnimationComplete={onAnimationComplete}
      aria-label={children}
    >
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          variants={itemV}
          style={{ display: per === 'word' ? 'inline-block' : 'inline' }}
        >
          {seg}
          {per === 'word' && i < segments.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </MotionTag>
  )
}
