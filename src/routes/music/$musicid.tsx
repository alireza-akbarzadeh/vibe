import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/music/$musicid')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/music/$music"!</div>
}
