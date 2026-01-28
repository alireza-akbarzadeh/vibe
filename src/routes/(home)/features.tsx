import { createFileRoute } from '@tanstack/react-router'
import { RootHeader } from '@/components/root-header'
import { FeaturesPage } from '@/domains/features/featured.domain'

export const Route = createFileRoute('/(home)/features')({
    component: RouteComponent,
})

function RouteComponent() {
    return <>
        <RootHeader />
        <FeaturesPage />
    </>
}
