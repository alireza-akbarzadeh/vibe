import { createFileRoute } from '@tanstack/react-router'
import { RootHeader } from '@/components/root-header'

export const Route = createFileRoute('/(home)/download')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        <RootHeader />

    </div>
}
