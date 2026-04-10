import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Runtime API base URL — no secrets, just the public endpoint */
export const API_URL =
  process.env.NEXT_PUBLIC_HANNA_API ?? 'https://hanna-api.afromations.workers.dev'
