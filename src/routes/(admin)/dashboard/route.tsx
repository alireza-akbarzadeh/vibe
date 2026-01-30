import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { AppSidebarLayout } from '@/domains/dashboard/components/app-sidebar-layout'
import { getSidebarData } from '@/domains/dashboard/server/dashboard.functions'

export const Route = createFileRoute('/(admin)/dashboard')({
    component: RouteComponent,
    loader: async ({ context }) => {
        const role = context.auth?.role ?? "customer";
        await context.queryClient.ensureQueryData({
            queryKey: ['sidebar', role],
            queryFn: () => getSidebarData({ data: role }),
        });
    },
    errorComponent: ({ error, reset }) => (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">System Error</h2>
                <p className="text-muted-foreground max-w-100">
                    We couldn't load the dashboard data. This might be a temporary connection issue.
                </p>
                <p className='text-red-400'>{error.message}</p>
            </div>
            <Button onClick={() => reset()} variant="outline">
                Try Again
            </Button>
        </div>
    ),
    pendingComponent: () => (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium animate-pulse text-muted-foreground">Syncing Staff Portal...</p>
            </div>
        </div>
    ),
    notFoundComponent: () => (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
            <div className="rounded-full bg-yellow-500/10 p-4">
                <AlertCircle className="h-10 w-10 text-yellow-500" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
                <p className="text-muted-foreground max-w-100">
                    The dashboard page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
            </div>
            <Link to="/dashboard" className={buttonVariants({ variant: "outline" })}>
                Go to Dashboard Home
            </Link>
        </div>
    ),
})

function RouteComponent() {
    return (
        <AppSidebarLayout />
    )
}