import { redirect } from 'next/navigation'

// /waitlist redirects to /apply — one canonical entry point for the application
export default function WaitlistPage() {
  redirect('/apply')
}
