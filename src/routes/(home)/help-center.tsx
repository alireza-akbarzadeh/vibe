import { createFileRoute } from '@tanstack/react-router'
import { Footer } from 'react-day-picker'
import { RootHeader } from '@/components/root-header'
import { HelpCenter } from '@/domains/help-center/help-center.domain'

export const Route = createFileRoute('/(home)/help-center')({
    component: RouteComponent,
})

function RouteComponent() {
    return <>
        <RootHeader />
        <HelpCenter />
        <Footer />
    </>
}
