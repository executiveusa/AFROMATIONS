import { redirect } from 'next/navigation'

// /artists redirects to directory for now
export default function ArtistsPage() {
  redirect('/directory')
}
