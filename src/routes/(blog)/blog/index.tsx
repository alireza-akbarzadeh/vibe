import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(blog)/blog/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(blog)/blog/"!</div>
}
