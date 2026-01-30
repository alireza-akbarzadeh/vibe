import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ICON_MAP, type SidebarItem } from '@/config/admin-sidebar'
import { cn } from '@/lib/utils'

export function SidebarNavItem({ item, isCollapsed, pathname }: { item: SidebarItem, isCollapsed: boolean, pathname: string }) {
    const hasChildren = !!(item.children && item.children.length > 0)
    const isChildActive = hasChildren && item.children?.some((c) => pathname.startsWith(c.href || ''))
    const [isOpen, setIsOpen] = useState(!!isChildActive)

    useEffect(() => {
        if (isChildActive) setIsOpen(true)
    }, [isChildActive])

    const isActive = pathname === item.href || isChildActive

    const itemClasses = cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 outline-none mb-1',
        isActive
            ? 'bg-secondary/80 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-border/50'
            : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground border border-transparent'
    )

    const renderIcon = (iconName?: string, active?: boolean) => {
        const IconComponent = iconName ? (ICON_MAP as any)[iconName] : null
        return (
            <div className={cn(
                "flex items-center justify-center shrink-0 transition-colors duration-200",
                isCollapsed ? "h-9 w-9" : "h-5 w-5",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}>
                {IconComponent ? (
                    <IconComponent size={isCollapsed ? 20 : 18} strokeWidth={active ? 2.5 : 2} />
                ) : (
                    <div className={cn("h-1.5 w-1.5 rounded-full bg-current transition-all", active ? "scale-125" : "opacity-30")} />
                )}
            </div>
        )
    }

    if (hasChildren && !isCollapsed) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                    <button className={cn(itemClasses, "w-full justify-between cursor-pointer")}>
                        <div className="flex items-center gap-3">
                            {renderIcon(item.icon, isActive)}
                            <span className={cn("transition-colors", isActive ? "font-semibold" : "font-medium")}>
                                {item.label}
                            </span>
                        </div>
                        <ChevronDown className={cn(
                            "h-3.5 w-3.5 transition-transform duration-300 opacity-40",
                            isOpen && "rotate-180 opacity-100 text-primary"
                        )} />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-[22px] mt-1 border-l border-border/60 pl-4 space-y-0.5">
                    {item.children?.map((child) => {
                        const isChildLinkActive = pathname === child.href
                        return (
                            <Link
                                key={child.href}
                                to={child.href}
                                className={cn(
                                    "block rounded-lg px-3 py-2 text-xs transition-all relative",
                                    isChildLinkActive
                                        ? "text-foreground font-bold bg-accent/50 shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                                )}
                            >
                                {isChildLinkActive && (
                                    <div className="absolute left-[-17px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                                )}
                                {child.label}
                            </Link>
                        )
                    })}
                </CollapsibleContent>
            </Collapsible>
        )
    }

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Link
                    to={item.href || '#'}
                    className={cn(itemClasses, isCollapsed && "justify-center p-0 h-10 w-10 mx-auto rounded-xl")}
                >
                    {renderIcon(item.icon, isActive)}
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {isActive && isCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                    )}
                </Link>
            </TooltipTrigger>
            {isCollapsed && (
                <TooltipContent side="right" sideOffset={10} className="bg-popover border-border px-3 py-1.5 text-xs font-bold shadow-xl">
                    {item.label}
                </TooltipContent>
            )}
        </Tooltip>
    )
}