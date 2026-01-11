import { createFileRoute } from '@tanstack/react-router'
import BackButton from '@/components/back-button'

export const Route = createFileRoute('/(home)/about')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        Hello "/(home)/about"!
        <BackButton />
    </div>
}
