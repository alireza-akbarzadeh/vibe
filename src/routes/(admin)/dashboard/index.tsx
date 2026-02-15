import { createFileRoute } from '@tanstack/react-router'
import DashboardMainPage from '@/domains/dashboard/container/dashboard-main'
// import { adminMiddleware, authMiddleware } from '@/middleware/auth'

export const Route = createFileRoute('/(admin)/dashboard/')({
    // TODO: Re-enable auth middleware after development
    // server: {
    //     middleware: [
    //         authMiddleware,
    //         adminMiddleware,
    //     ],
    // },
    component: RouteComponent,

})

function RouteComponent() {
    return <DashboardMainPage />
}
