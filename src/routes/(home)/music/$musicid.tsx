import { createFileRoute } from '@tanstack/react-router'
import { MusicDomain } from '@/domains/music/music.domain'

export const Route = createFileRoute('/(home)/music/$musicid')({
    component: RouteComponent,
})

function RouteComponent() {
    return <MusicDomain />
}
