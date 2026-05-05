import { Suspense } from 'react'
import ViewMapContent from './view-map-content'

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#303030]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cintelYellow"></div>
    </div>
  )
}

export default function ViewMapPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ViewMapContent />
    </Suspense>
  )
}