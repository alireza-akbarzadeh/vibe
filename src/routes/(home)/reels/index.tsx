import { createFileRoute } from '@tanstack/react-router'
import { ReelsDomain } from '@/domains/reels/reels.domain'

export const Route = createFileRoute('/(home)/reels/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <ReelsDomain />
}
