import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/subscription/status')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/subscription/status"!</div>
}
