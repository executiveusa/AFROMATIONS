'use client'

import {
  animate,
  motion,
  useInView,
  type Variant,
  type Transition,
  type UseInViewOptions,
} from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface InViewProps {
  children: ReactNode
  variants?: {
    hidden: Variant
    visible: Variant
  }
  transition?: Transition
  viewOptions?: UseInViewOptions
  as?: React.ElementType
  once?: boolean
  className?: string
}

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = 'div',
  once = false,
  className,
}: InViewProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, ...viewOptions })

  if (as === 'div') {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  if (as === 'span') {
    return (
      <motion.span
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
        transition={transition}
        className={className}
      >
        {children}
      </motion.span>
    )
  }

  if (as === 'p') {
    return (
      <motion.p
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
        transition={transition}
        className={className}
      >
        {children}
      </motion.p>
    )
  }

  if (as === 'h1') {
    return (
      <motion.h1
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
        transition={transition}
        className={className}
      >
        {children}
      </motion.h1>
    )
  }

  // Default to motion.div
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
