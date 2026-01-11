import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/careers')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(home)/careers"!</div>
}
