import { Link as RouterLink } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export function NavItem({
    icon: Icon,
    label,
    to,
    exact = true,
    isCollapsed = false // 1. Added prop
}: {
    icon: LucideIcon,
    label: string,
    to: string,
    exact?: boolean,
    isCollapsed?: boolean // 2. Added type
}) {
    return (
        <RouterLink
            to={to}
            activeOptions={{ exact }}
            className="block group no-underline"
        >
            {({ isActive }) => (
                <div className={`
                    flex items-center rounded-md transition-all duration-300 relative
                    ${isCollapsed ? 'justify-center px-0 py-4' : 'px-3 py-3 gap-5'} 
                    ${isActive
                        ? 'text-white bg-white/5'
                        : 'text-gray-400 group-hover:text-white group-hover:bg-white/5'
                    }
                `}>
                    {/* Active Gradient Indicator - Styled as a small dot or bar when collapsed */}
                    {isActive && (
                        <div className={`
                            absolute left-0 bg-linear-to-b from-purple-500 to-pink-500 rounded-r-full
                            ${isCollapsed ? 'w-1 h-8' : 'w-1 h-6'}
                        `} />
                    )}

                    <Icon className={`w-6 h-6 shrink-0 transition-colors ${isActive ? 'text-pink-500' : 'group-hover:text-white'
                        }`} />

                    {/* 3. Conditionally render the label based on isCollapsed */}
                    {!isCollapsed && (
                        <span className={`font-bold transition-colors truncate ${isActive ? 'text-white' : ''
                            }`}>
                            {label}
                        </span>
                    )}

                    {/* Optional: Tooltip for collapsed state */}
                    {isCollapsed && (
                        <div className="absolute left-16 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity border border-white/10 shadow-xl">
                            {label}
                        </div>
                    )}
                </div>
            )}
        </RouterLink>
    );
}