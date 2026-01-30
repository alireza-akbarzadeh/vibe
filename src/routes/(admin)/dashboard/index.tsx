import { createFileRoute } from '@tanstack/react-router'
import DashboardMainPage from '@/domains/dashboard/container/dashboard-main'

export const Route = createFileRoute('/(admin)/dashboard/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <DashboardMainPage />
}
