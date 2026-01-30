import { motion } from 'framer-motion'
import { ChevronLeft, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { SidebarGroup } from '@/config/admin-sidebar'
import { cn } from '@/lib/utils'
import { actions } from '../store/dashboard.store'
import { SidebarNavItem } from './sidebar-nav-item'
import { SystemHealth } from './system-health'
import { UserProfile } from './user-profile'
import { WorkspaceSwitcher } from './workspace-switcher'

export function AdminSidebar({
    groups,
    pathname,
    isMobile = false,
    className
}: {
    groups: SidebarGroup[],
    pathname: string,
    isMobile?: boolean,
    className?: string
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const effectiveCollapsed = isMobile ? false : isCollapsed

    return (
        <motion.aside
            initial={false}
            animate={{ width: effectiveCollapsed ? 76 : 280 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                "relative z-30 flex h-full flex-col border-r bg-card/50 backdrop-blur-md shrink-0",
                "overflow-visible", // Crucial for tooltips/dropdowns
                className
            )}
        >
            {/* 1. Workspace Switcher - Pinned at Top */}
            <div className="shrink-0 p-2">
                <WorkspaceSwitcher isCollapsed={effectiveCollapsed} />
            </div>

            {/* 2. Header & Collapse Toggle */}
            <div className="flex h-12 items-center justify-between px-4 shrink-0 overflow-hidden">
                {!effectiveCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/50 uppercase pl-2 whitespace-nowrap"
                    >
                        Management
                    </motion.span>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7 transition-all hover:bg-primary/10", effectiveCollapsed ? "mx-auto" : "ml-auto")}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-transform text-muted-foreground", effectiveCollapsed && "rotate-180")} />
                </Button>
            </div>

            {/* 3. Quick Search - Powered by TanStack Store */}
            <div className="px-3 mb-4 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "transition-all bg-muted/30 border-none hover:bg-muted/50 text-muted-foreground shadow-inner",
                        effectiveCollapsed ? "w-10 h-10 p-0 justify-center mx-auto rounded-xl" : "w-full justify-start gap-2 rounded-xl"
                    )}
                    onClick={() => actions.setSearchOpen(true)}
                >
                    <Search className="h-4 w-4 shrink-0" />
                    {!effectiveCollapsed && <span className="text-xs font-medium">Quick Search...</span>}
                    {!effectiveCollapsed && (
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
                            ⌘K
                        </kbd>
                    )}
                </Button>
            </div>

            <Separator className={cn("mb-4 opacity-50", effectiveCollapsed ? "mx-auto w-10" : "mx-4 w-auto")} />

            {/* 4. Main Navigation Area */}
            <ScrollArea className="flex-1 w-full" type="auto">
                <div className={cn(
                    "flex flex-col gap-8 pb-10 transition-all duration-300",
                    effectiveCollapsed ? "items-center" : "px-3"
                )}>
                    {groups.map((group) => (
                        <div key={group.group} className="w-full space-y-1">
                            {!effectiveCollapsed && (
                                <h4 className="mb-2 px-3 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] whitespace-nowrap">
                                    {group.group}
                                </h4>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map((item) => (
                                    <SidebarNavItem
                                        key={item.label}
                                        item={item}
                                        isCollapsed={effectiveCollapsed}
                                        pathname={pathname}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* 5. Bottom Pinned Section (System Health + Profile) */}
            <div className="mt-auto flex flex-col gap-1 border-t bg-card/80 p-2 shrink-0">
                <SystemHealth isCollapsed={effectiveCollapsed} />
                <UserProfile variant="sidebar" isCollapsed={effectiveCollapsed} />
            </div>
        </motion.aside>
    )
}