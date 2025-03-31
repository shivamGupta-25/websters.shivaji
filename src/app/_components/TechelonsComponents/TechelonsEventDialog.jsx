"use client"

import dynamic from 'next/dynamic'
import TechelonsEventDialogboxSkeleton from '../Skeletons/TechelonsEventDialogboxSkeleton'

// Dynamically import the EventModal component with SSR disabled and a custom loading state
const EventModal = dynamic(
  () => import('./EventDialog/index.jsx' /* webpackChunkName: "event-dialog" */),
  {
    ssr: false,
    loading: () => <TechelonsEventDialogboxSkeleton />
  }
)

export default EventModal;