// components/admin-sidebar/index.tsx

import { motion } from 'framer-motion'
import { ChevronLeft, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { SidebarGroup } from '@/config/admin-sidebar'
import { cn } from '@/lib/utils'
import { SidebarNavItem } from './sidebar-nav-item'
import { UserProfile } from './user-profile'

export function AdminSidebar({
    groups,
    pathname,
    onSearchOpen,
    isMobile = false,
    className
}: {
    groups: SidebarGroup[],
    pathname: string,
    onSearchOpen: () => void,
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
            // REMOVED overflow-hidden so tooltips can show
            className={cn(
                "relative z-30 flex h-full flex-col border-r bg-card/50 backdrop-blur-md shrink-0",
                className
            )}
        >
            {/* Header - Fixed Height */}
            <div className="flex h-14 items-center justify-between px-4 shrink-0 overflow-hidden">
                {!effectiveCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-black tracking-widest text-primary uppercase pl-2 whitespace-nowrap"
                    >
                        Vibe Staff
                    </motion.span>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8 transition-all", effectiveCollapsed ? "mx-auto" : "ml-auto")}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-transform", effectiveCollapsed && "rotate-180")} />
                </Button>
            </div>

            {/* Quick Search */}
            <div className="px-3 mb-4 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "transition-all bg-muted/30 border-none hover:bg-muted/50 text-muted-foreground",
                        effectiveCollapsed ? "w-10 h-10 p-0 justify-center mx-auto" : "w-full justify-start gap-2"
                    )}
                    onClick={onSearchOpen}
                >
                    <Search className="h-4 w-4 shrink-0" />
                    {!effectiveCollapsed && <span className="text-xs">Search...</span>}
                </Button>
            </div>

            <Separator className={cn("mb-4 opacity-50", effectiveCollapsed ? "mx-auto w-10" : "mx-4 w-auto")} />

            {/* Content Area - Uses overflow-visible to allow tooltips to pop out */}
            <ScrollArea className="flex-1 overflow-visible">
                <div className={cn(
                    "flex flex-col gap-8 pb-10 transition-all duration-300",
                    effectiveCollapsed ? "items-center" : "px-3"
                )}>
                    {groups.map((group) => (
                        <div key={group.group} className="w-full space-y-1">
                            {!effectiveCollapsed && (
                                <h4 className="mb-2 px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
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

            <div className="mt-auto border-t bg-card/80 p-2">
                <UserProfile isCollapsed={effectiveCollapsed} />
            </div>
        </motion.aside>
    )
}