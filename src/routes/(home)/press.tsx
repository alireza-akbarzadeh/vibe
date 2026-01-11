import { createFileRoute } from '@tanstack/react-router'
import BackButton from '@/components/back-button'

export const Route = createFileRoute('/(home)/press')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(home)/press"!
        <BackButton />
    </div>
}
