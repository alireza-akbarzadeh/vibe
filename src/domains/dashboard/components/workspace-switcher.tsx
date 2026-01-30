import { ChevronsUpDown, Globe, LayoutPanelLeft, Plus, Zap } from "lucide-react"
import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function WorkspaceSwitcher({ isCollapsed }: { isCollapsed: boolean }) {
    const workspaces = [
        { name: "Vibe Main", icon: LayoutPanelLeft, plan: "Enterprise" },
        { name: "Vibe Events", icon: Zap, plan: "Pro" },
        { name: "Global Admin", icon: Globe, plan: "Internal" },
    ]

    const [activeWorkspace, setActiveWorkspace] = React.useState(workspaces[0])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn(
                    "flex items-center gap-3 w-full p-2 rounded-xl transition-all duration-200 outline-none",
                    "hover:bg-accent/50 group border border-transparent hover:border-border/50",
                    isCollapsed && "justify-center"
                )}>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 shadow-lg shadow-primary/20">
                        <activeWorkspace.icon className="size-5" />
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-1 flex-col items-start text-left min-w-0">
                            <span className="text-sm font-bold truncate w-full tracking-tight">
                                {activeWorkspace.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                {activeWorkspace.plan}
                            </span>
                        </div>
                    )}

                    {!isCollapsed && (
                        <ChevronsUpDown className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-border/50 bg-popover/95 backdrop-blur-md" align="start" sideOffset={8}>
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Switch Workspace
                </DropdownMenuLabel>

                {workspaces.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace.name}
                        onClick={() => setActiveWorkspace(workspace)}
                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer group"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg border bg-muted/50 group-focus:bg-primary/10 transition-colors">
                            <workspace.icon className="size-4 text-muted-foreground group-focus:text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{workspace.name}</span>
                            <span className="text-[10px] text-muted-foreground">{workspace.plan}</span>
                        </div>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer text-muted-foreground hover:text-foreground">
                    <Plus className="size-4" />
                    <span className="text-sm font-medium">Create Workspace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}