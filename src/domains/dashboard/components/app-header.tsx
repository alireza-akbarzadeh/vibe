import { Film, LayoutGrid, Menu, Plus, Search, Users, Zap } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useDashboardShortcuts } from '../hooks/useDahboardShortcut'
import { actions } from '../store/dashboard.store'
import { DashboardBreadcrumbs } from './breadcrumbs'
import Notification from './notification'
import { UserProfile } from './user-profile'

interface AppHeaderProps {
    pathname: string;
}

export default function AppHeader({ pathname }: AppHeaderProps) {
    const [isScrolled, setIsScrolled] = React.useState(false)

    // Global Shortcuts now handle state via Store internally
    useDashboardShortcuts();

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={cn(
            "flex h-14 shrink-0 items-center gap-4 px-4 md:px-6 sticky top-0 z-20 transition-all duration-300",
            isScrolled
                ? "bg-card/90 backdrop-blur-xl border-b shadow-sm"
                : "bg-transparent border-b border-transparent"
        )}>
            {/* Mobile Menu Toggle - Uses Store Action */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-accent/50"
                onClick={() => actions.setMobileSidebarOpen(true)}
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full border border-border/40">
                    <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
                    <DashboardBreadcrumbs pathname={pathname} />
                </div>

                <div className="flex-1 max-w-md ml-auto md:ml-0 group">
                    <Button
                        variant="outline"
                        className={cn(
                            "relative h-10 w-full justify-start text-sm text-muted-foreground rounded-xl transition-all duration-300",
                            "bg-muted/40 hover:bg-muted/60 border-none ring-1 ring-border/50 group-hover:ring-primary/30 shadow-inner"
                        )}
                        // Uses Store Action
                        onClick={() => actions.setSearchOpen(true)}
                    >
                        <Search className="mr-2 h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
                        <span className="hidden lg:inline font-medium">Search Command...</span>
                        <span className="lg:hidden">Search...</span>

                        <div className="pointer-events-none absolute right-2 top-2 h-6 select-none items-center gap-1 rounded-lg border bg-background px-2 font-mono text-[10px] font-bold shadow-sm hidden sm:flex">
                            <span className="text-[12px]">⌘</span>K
                        </div>
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-9 gap-2 px-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all hidden sm:flex"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Create</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-border/40 bg-popover/95 backdrop-blur-md">
                        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-2">
                            Quick Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="opacity-50" />
                        <DropdownMenuItem className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer">
                            <div className="bg-blue-500/10 p-2 rounded-lg"><Film className="w-4 h-4 text-blue-500" /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">New Movie</span>
                                <span className="text-[10px] text-muted-foreground font-mono">N</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer">
                            <div className="bg-purple-500/10 p-2 rounded-lg"><LayoutGrid className="w-4 h-4 text-purple-500" /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">New Series</span>
                                <span className="text-[10px] text-muted-foreground font-mono">S</span>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer">
                            <div className="bg-emerald-500/10 p-2 rounded-lg"><Users className="w-4 h-4 text-emerald-500" /></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">New Staff</span>
                                <span className="text-[10px] text-muted-foreground font-mono">U</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-6 bg-border/40 mx-2 hidden sm:block" />
                <Notification />
                <UserProfile variant='header' />
            </div>
        </header>
    )
}