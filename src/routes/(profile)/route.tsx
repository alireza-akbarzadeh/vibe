import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(profile)')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        Layout "/(profile)"!
        <Outlet />
    </div>
}
