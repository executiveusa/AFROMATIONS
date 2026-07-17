export interface MangaSeries {
  id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  seriesType: 'manga' | 'comic' | 'lesson'
  readingDirection: 'rtl' | 'ltr'
  status: 'draft' | 'published'
  coverImageUrl?: string
  createdByAgent?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface MangaChapter {
  id: string
  seriesId: string
  slug: string
  title: string
  subtitle?: string
  chapterNumber?: number
  summary?: string
  status: 'draft' | 'published'
  accessLevel: 'public' | 'private' | 'paid'
  readingDirection?: 'rtl' | 'ltr'
  hasCover: boolean
  pageTurnMode: 'single' | 'spread'
  layoutMode: 'inline' | 'wide' | 'browserFullscreen' | 'nativeFullscreen'
  coverImageUrl?: string
  publishedAt?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface MangaPage {
  id: string
  chapterId: string
  pageIndex: number
  pageId: string
  pageType: 'image' | 'html'
  imageUrl?: string
  thumbnailUrl?: string
  html?: string
  width?: number
  height?: number
  alt?: string
  label?: string
  metadata?: Record<string, unknown>
}

export interface ComimiImagePageDefinition {
  id: string
  type: 'image'
  src: string
  thumbnailSrc?: string
  alt?: string
  label?: string
}

export interface ComimiHtmlPageDefinition {
  id: string
  type: 'html'
  html: string
  label?: string
  sandbox?: string
  aspectRatio?: number
}

export type ComimiPageDefinition = ComimiImagePageDefinition | ComimiHtmlPageDefinition

export interface ReaderSettings {
  layoutMode: 'inline' | 'wide' | 'browserFullscreen' | 'nativeFullscreen'
  readingDirection: 'rtl' | 'ltr'
  hasCover: boolean
  pageTurnMode: 'single' | 'spread'
  backgroundColor?: 'white' | 'black'
  lockLayoutMode?: boolean
}

export interface MangaManifest {
  manga: {
    id: string
    title: string
    author: string
    pages: ComimiPageDefinition[]
  }
  settings: ReaderSettings
  locale: string
}

export const DEFAULT_MANGA_SETTINGS: ReaderSettings = {
  layoutMode: 'inline',
  readingDirection: 'rtl',
  hasCover: true,
  pageTurnMode: 'single',
  backgroundColor: 'black',
}

export const DEFAULT_COMIC_SETTINGS: ReaderSettings = {
  layoutMode: 'inline',
  readingDirection: 'ltr',
  hasCover: true,
  pageTurnMode: 'single',
  backgroundColor: 'black',
}
