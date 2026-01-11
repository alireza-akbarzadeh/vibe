import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(home)/terms"!</div>
}
