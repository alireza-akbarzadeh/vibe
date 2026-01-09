import { createFileRoute } from '@tanstack/react-router'
import { MusicDomain } from '@/domains/music/music.domain'

export const Route = createFileRoute('/(home)/music/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <MusicDomain />
}
