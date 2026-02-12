import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/tow-fa-setup')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(auth)/2fa-setup"!</div>
}
