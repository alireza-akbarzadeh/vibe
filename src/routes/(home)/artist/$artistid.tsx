import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/artist/$artistid')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/artist/$artistid"!</div>
}
