import { createFileRoute } from '@tanstack/react-router'
import { RootHeader } from '@/components/root-header'
import { Typography } from '@/components/ui/typography'

export const Route = createFileRoute('/(home)/features')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        <RootHeader />
        <Typography.P className='leading-30'>
            Hello "/(home)/features"!
        </Typography.P>
    </div>
}
