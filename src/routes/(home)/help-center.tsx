import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/help-center')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(home)/help-center"!</div>
}
