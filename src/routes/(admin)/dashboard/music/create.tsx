import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/dashboard/music/create')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(admin)/dashboard/music/create"!</div>
}
