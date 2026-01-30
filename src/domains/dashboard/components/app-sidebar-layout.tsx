import { useQuery } from '@tanstack/react-query'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'; // Added
import { getSidebarData } from '../server/dahboard.functions'
import AppHeader from './app-header';
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
                    <AppHeader pathname={pathname} setMobileOpen={setMobileOpen} setSearchOpen={setSearchOpen} />
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