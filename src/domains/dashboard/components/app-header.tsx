import { LogOut, Menu, Plus, Search, Settings, User } from 'lucide-react'
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
import { DashboardBreadcrumbs } from './breadcrumbs'
import Notification from './notification'

interface AppHeaderProps {
    pathname: string;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppHeader({ pathname, setMobileOpen, setSearchOpen }: AppHeaderProps) {
    return (
        <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4 md:px-6 bg-card/80 backdrop-blur-md sticky top-0 z-20">
            {/* Mobile Menu Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open Menu"
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-6 flex-1 min-w-0">
                {/* Breadcrumbs - Hidden on very small screens if necessary */}
                <div className="hidden sm:block truncate">
                    <DashboardBreadcrumbs pathname={pathname} />
                </div>

                {/* Search Bar Container */}
                <div className="flex-1 max-w-md ml-auto md:ml-0">
                    <Button
                        variant="outline"
                        className="relative h-9 w-full justify-start text-sm text-muted-foreground bg-muted/40 hover:bg-muted/60 border-none rounded-xl transition-all"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search className="mr-2 h-4 w-4 shrink-0" />
                        <span className="hidden lg:inline">Search dashboard...</span>
                        <span className="lg:hidden">Search...</span>
                        <kbd className="pointer-events-none absolute right-2 top-2 h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 hidden sm:flex">
                            ⌘K
                        </kbd>
                    </Button>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 ml-auto">
                {/* Quick Create Action */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl flex">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">New Movie</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">New Playlist</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Add User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>


                <Notification />

                <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

                {/* User Settings Dropdown (Alternative to Sidebar UserProfile) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-full overflow-hidden border border-border/50">
                            <img
                                src="https://github.com/shadcn.png"
                                alt="User"
                                className="h-full w-full object-cover"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl mt-1">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Admin User</p>
                                <p className="text-xs leading-none text-muted-foreground">admin@vibestaff.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                            <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

function Separator({ className, orientation = "horizontal" }: { className?: string, orientation?: "horizontal" | "vertical" }) {
    return (
        <div className={cn(
            "shrink-0 bg-border",
            orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
            className
        )} />
    )
}