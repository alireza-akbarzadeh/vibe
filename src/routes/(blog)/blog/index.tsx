import { createFileRoute } from '@tanstack/react-router'
import Blog from '@/domains/blog/blog.domain'

export const Route = createFileRoute('/(blog)/blog/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Blog />
}
