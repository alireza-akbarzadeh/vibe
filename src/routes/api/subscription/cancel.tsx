import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/subscription/cancel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/subscription/cancel"!</div>
}
