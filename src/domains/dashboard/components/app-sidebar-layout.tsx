import { useQuery } from '@tanstack/react-query'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip' // Added
import { getSidebarData } from '../server/dahboard.functions'
import { DashboardBreadcrumbs } from './breadcrumbs'
import { SearchSide } from './search-setting'
import { AdminSidebar } from './sidebar'

export function AppSidebarLayout() {
    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = useRouterState().location.pathname
    const userRole = "admin"

    const { data: groups = [] } = useQuery({
        queryKey: ['sidebar', userRole],
        queryFn: () => getSidebarData({ data: userRole }),
        staleTime: 1000 * 60 * 10,
    })

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <AdminSidebar
                    pathname={pathname}
                    groups={groups}
                    onSearchOpen={() => setSearchOpen(true)}
                    className="hidden md:flex"
                />

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side="left" className="p-0 w-72 border-none">
                        <AdminSidebar
                            pathname={pathname}
                            groups={groups}
                            isMobile
                            onSearchOpen={() => {
                                setSearchOpen(true)
                                setMobileOpen(false)
                            }}
                        />
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                    <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4 md:px-6 bg-card/80 backdrop-blur-md sticky top-0 z-20">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-6 flex-1">
                            <DashboardBreadcrumbs pathname={pathname} />
                            <div className="flex-1 max-w-md ml-auto md:ml-0">
                                <Button
                                    variant="outline"
                                    className="relative h-9 w-full max-w-100 justify-start text-sm text-muted-foreground bg-muted/50 rounded-xl"
                                    onClick={() => setSearchOpen(true)}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Search dashboard...</span>
                                    <span className="sm:hidden text-xs">Search...</span>
                                    <kbd className="pointer-events-none absolute right-2 top-2 h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:flex">
                                        ⌘K
                                    </kbd>
                                </Button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-muted/30">
                        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
                            <Outlet />
                        </div>
                    </main>
                </div>
                <SearchSide data={groups} open={searchOpen} setOpen={setSearchOpen} />
            </div>
        </TooltipProvider>
    )
}