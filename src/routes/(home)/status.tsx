import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/status')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(home)/status"!</div>
}
