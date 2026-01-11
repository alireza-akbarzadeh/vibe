import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/contact')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(home)/contact"!</div>
}
