import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/webhook/polar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/webhook/polar"!</div>
}
