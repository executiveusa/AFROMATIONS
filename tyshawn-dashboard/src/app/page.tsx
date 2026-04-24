import { StudioQuadrant } from '@/components/quadrant-studio'
import { LearnQuadrant } from '@/components/quadrant-learn'
import { AnalyticsQuadrant } from '@/components/quadrant-analytics'
import { ContentQuadrant } from '@/components/quadrant-content'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatusBar } from '@/components/status-bar'

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <StatusBar />

      {/* 4-quadrant grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--af-grey-mid)]">
        <StudioQuadrant />
        <LearnQuadrant />
        <AnalyticsQuadrant />
        <ContentQuadrant />
      </main>
    </div>
  )
}
