import type { ColumnDef } from "@tanstack/react-table"
import {
    AlertCircle,
    CheckCircle2, Clock, Edit2, ExternalLink, Monitor,
    MoreHorizontal, Phone, ShieldAlert, ShieldCheck,
    Smartphone, Tablet, Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import type { Transaction } from "../../server/mock-data"

export const userColumns: ColumnDef<Transaction>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-0.5 border-muted-foreground/50"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-0.5 border-muted-foreground/50"
            />
        ),
    },
    {
        accessorKey: "user",
        header: "Subscriber",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[10px] text-primary">
                        {(row.getValue("user") as string).charAt(0)}
                    </div>
                    {row.original.verified ? (
                        <ShieldCheck className="size-3 text-emerald-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
                    ) : (
                        <ShieldAlert className="size-3 text-amber-500 absolute -bottom-1 -right-1 bg-background rounded-full" />
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-foreground leading-none">{row.getValue("user")}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">{row.original.email}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Contact",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3 opacity-50" />
                <span className="text-[11px] font-medium">{row.getValue("phone")}</span>
            </div>
        )
    },
    {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => {
            const plan = row.getValue("plan") as string
            return (
                <div className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-md border w-fit uppercase tracking-tighter",
                    plan === 'Premium' ? "bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_10px_-2px_rgba(168,85,247,0.2)]" :
                        plan === 'Standard' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            "bg-slate-500/10 text-slate-500 border-slate-500/20"
                )}>
                    {plan}
                </div>
            )
        }
    },
    {
        accessorKey: "lastLogin",
        header: "Activity",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="text-muted-foreground/40">
                    {row.original.device === 'Desktop' && <Monitor className="size-3.5" />}
                    {row.original.device === 'Mobile' && <Smartphone className="size-3.5" />}
                    {row.original.device === 'Tablet' && <Tablet className="size-3.5" />}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">{row.getValue("lastLogin")}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/60 italic">{row.original.ipAddress}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Billing",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase border w-fit",
                    status === 'Success' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        status === 'Pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-destructive/10 text-destructive border-destructive/20"
                )}>
                    {status === 'Success' ? <CheckCircle2 className="size-3" /> :
                        status === 'Pending' ? <Clock className="size-3" /> : <AlertCircle className="size-3" />}
                    {status}
                </div>
            )
        }
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Lifetime</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <span className="font-mono font-bold text-foreground text-sm">
                    ${parseFloat(row.getValue("amount")).toFixed(2)}
                </span>
            </div>
        )
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.location}</span>
    },
    {
        accessorKey: "riskScore",
        header: "Risk",
        cell: ({ row }) => {
            const score = row.original.riskScore
            return (
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn("h-full", score > 0.5 ? "bg-destructive" : "bg-emerald-500")}
                            style={{ width: `${score * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono">{(score * 100).toFixed(0)}%</span>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: () => (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/40 bg-popover/95 backdrop-blur-md">
                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 py-2 px-3">Quick Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 cursor-pointer py-2 rounded-lg">
                            <ExternalLink className="size-3.5 text-blue-500" /> User Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer py-2 rounded-lg">
                            <Edit2 className="size-3.5 text-amber-500" /> Edit Subscription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem className="gap-2 cursor-pointer py-2 rounded-lg text-destructive focus:bg-destructive/10">
                            <Trash2 className="size-3.5" /> Suspend Account
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }
]