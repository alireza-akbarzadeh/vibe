/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { flexRender } from "@tanstack/react-table"
import { Check, ChevronDown, Download, RotateCcw, Search, Trash2, X } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { DataTablePagination } from "./data-table-pagination"
import { TableRoot, useTableContext } from "./table-context"



// 1. DEFINE GENERIC INTERFACES
export interface StatusOption {
    label: string
    value?: string
    icon: React.ComponentType<{ className?: string }>
    color: string
}

interface SearchProps {
    columnId: string
    placeholder: string
}

interface FilterTabsProps {
    columnId: string
    options: string[]
}

interface StatusFiltersProps {
    columnId: string
    options: StatusOption[]
    title?: string
}

interface BodyProps<TData> {
    columnsCount: number
    onRowDoubleClick?: (row: Row<TData>) => void
}

import type { Row } from "@tanstack/react-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Skeleton } from "../ui/skeleton"

interface BulkActionsProps<TData> {
    onDelete?: (rows: Row<TData>[]) => void
    onDownload?: (rows: Row<TData>[]) => void
    deleteTitle?: string
    deleteDescription?: string
}

export const Table = {
    Root: TableRoot,


    Search: ({ columnId, placeholder }: SearchProps) => {
        const { table } = useTableContext()
        const column = table.getColumn(columnId)

        return (
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <Input
                    placeholder={placeholder}
                    value={(column?.getFilterValue() as string) ?? ""}
                    onChange={(e) => column?.setFilterValue(e.target.value)}
                    className="pl-9 bg-card/40 border-border/40 rounded-2xl h-11"
                />
            </div>
        )
    },

    FilterTabs: ({ columnId, options }: FilterTabsProps) => {
        const { table } = useTableContext()
        const column = table.getColumn(columnId)
        const currentValue = (column?.getFilterValue() as string) ?? ""
        const [open, setOpen] = React.useState(false)

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "h-11 w-full md:w-44 justify-between rounded-2xl border-border/40 bg-card/40 px-4",
                            "text-[11px] font-black uppercase tracking-widest transition-all",
                            currentValue && "border-primary/40 bg-primary/5 text-primary"
                        )}
                    >
                        <span className="truncate">{currentValue || "All Categories"}</span>
                        <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-200 opacity-50", open && "rotate-180")} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    className="w-[--radix-popover-trigger-width] p-1.5 bg-[#0d1117]/95 backdrop-blur-xl border-border/40 shadow-2xl rounded-2xl"
                >
                    <div className="flex flex-col gap-1">
                        {options.map((opt) => {
                            const isActive = (opt === 'All' ? currentValue === "" : currentValue === opt)
                            return (
                                <Button
                                    key={opt}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        column?.setFilterValue(opt === 'All' ? "" : opt)
                                        setOpen(false)
                                    }}
                                    className={cn(
                                        "justify-start rounded-xl px-3 text-[10px] font-bold uppercase tracking-wider h-9 transition-all",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center w-full">
                                        {isActive ? (
                                            <Check className="mr-2 size-3 stroke-[3]" />
                                        ) : (
                                            <div className="mr-2 size-3" />
                                        )}
                                        {opt}
                                    </div>
                                </Button>
                            )
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        )
    },
    StatusFilters: ({ columnId, options, title = "Status" }: StatusFiltersProps) => {
        const { table } = useTableContext()
        const column = table.getColumn(columnId)
        const currentValue = (column?.getFilterValue() as string) ?? ""
        const [open, setOpen] = React.useState(false)

        // Find the currently active option to display in the trigger
        const activeOption = options.find((opt) => (opt.value ?? opt.label) === currentValue)

        return (
            <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-1">
                    {title}:
                </span>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "h-10 w-full md:w-[200px] justify-between rounded-xl border-border/40 bg-[#0d1117] text-[11px] font-bold uppercase tracking-wider transition-all",
                                currentValue ? "text-primary border-primary/30" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-2 truncate">
                                {activeOption ? (
                                    <>
                                        <activeOption.icon className={cn("size-3.5", activeOption.color)} />
                                        <span>{activeOption.label}</span>
                                    </>
                                ) : (
                                    <span>Select {title}</span>
                                )}
                            </div>
                            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-[#0d1117] border-border/40 shadow-2xl" align="start">
                        <Command className="bg-transparent">
                            <CommandInput placeholder={`Filter ${title}...`} className="h-9 text-xs" />
                            <CommandList>
                                <CommandEmpty className="py-2 text-[10px] text-center uppercase text-muted-foreground">No results</CommandEmpty>
                                <CommandGroup>
                                    {options.map((s) => {
                                        const filterValue = s.value ?? s.label
                                        const isActive = currentValue === filterValue
                                        const Icon = s.icon

                                        return (
                                            <CommandItem
                                                key={s.label}
                                                onSelect={() => {
                                                    column?.setFilterValue(isActive ? "" : filterValue)
                                                    setOpen(false)
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-[11px] font-bold uppercase"
                                            >
                                                <Icon className={cn("size-3.5", s.color)} />
                                                <span className="flex-1">{s.label}</span>
                                                {isActive && <Check className="size-3 text-primary" />}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </CommandList>
                            {currentValue && (
                                <div className="p-1 border-t border-border/10">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            column?.setFilterValue("")
                                            setOpen(false)
                                        }}
                                        className="w-full h-8 text-[10px] font-bold uppercase text-destructive hover:text-destructive/80"
                                    >
                                        <RotateCcw className="mr-2 size-3" />
                                        Reset Filter
                                    </Button>
                                </div>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        )
    },
    Body: <TData,>({ columnsCount, onRowDoubleClick }: BodyProps<TData>) => {
        const { table } = useTableContext<TData>()
        const rows = table.getRowModel().rows

        return (
            <div className="relative group/container">
                {/* 1. OVERFLOW WRAPPER with Custom Scrollbar */}
                <div className="rounded-[2rem] border border-border/40 bg-card/20 backdrop-blur-2xl shadow-2xl overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-primary/30">
                    <table className="w-full text-sm min-w-[1000px]"> {/* Min-width ensures scrolling on small screens */}
                        <thead className="bg-muted/50 border-b border-border/40">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className={cn(
                                                "p-5 text-left font-black text-muted-foreground uppercase tracking-widest text-[10px]",
                                                // Sticky Header for the first column (Identity)
                                                header.column.id === "name" && "sticky left-0 z-20 "
                                            )}
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {rows.length > 0 ? (
                                rows.map(row => (
                                    <tr
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-primary/3 transition-colors group/row"
                                        onDoubleClick={() => onRowDoubleClick?.(row)}
                                        onClick={() => {
                                            row.toggleSelected(!row.getIsSelected());
                                        }}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                className={cn(
                                                    "p-4 align-middle transition-colors",
                                                    cell.column.id === "name" && "sticky left-0 z-10  backdrop-blur-md border-r border-border/20 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.1)]"
                                                )}
                                            >
                                                <div className="flex items-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columnsCount} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="p-4 rounded-full bg-muted/10">
                                                <X className="h-6 w-6 text-muted-foreground/40" />
                                            </div>
                                            <span className="text-muted-foreground font-medium italic">No identities match your current filters</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 2. VISUAL AFFORDANCE: Right-side Fade Mask */}
                <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background/40 to-transparent pointer-events-none rounded-r-[2rem] opacity-0 group-hover/container:opacity-100 transition-opacity" />
            </div>
        )
    },

    Pagination: () => {
        const { table } = useTableContext()
        return <DataTablePagination table={table} />
    },

    BulkActions: <TData,>({
        onDelete,
        onDownload,
        deleteTitle = "Are you sure?",
        deleteDescription = "This action cannot be undone. Selected records will be permanently removed."
    }: BulkActionsProps<TData>) => {
        const { table } = useTableContext<TData>()
        const selectedRows = table.getFilteredSelectedRowModel().rows

        if (selectedRows.length === 0) return null

        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                {/* DELETE DIALOG */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-destructive/20"
                        >
                            <Trash2 className="mr-1.5 size-3" />
                            Delete ({selectedRows.length})
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {deleteDescription}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete?.(selectedRows)}
                                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Confirm Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* DOWNLOAD BUTTON */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload?.(selectedRows)}
                    className="h-8 rounded-lg text-[10px] font-bold uppercase border-border/40 bg-card/50"
                >
                    <Download className="mr-1.5 size-3" />
                    Export CSV
                </Button>
            </div>
        )
    },
    Loading: ({ columnsCount, rowsCount = 5 }: { columnsCount: number, rowsCount?: number }) => {
        return (
            <div className="rounded-3xl border border-border/40 bg-card/20 backdrop-blur-2xl overflow-hidden shadow-2xl">
                <div className="w-full">
                    {/* Skeleton Header */}
                    <div className="flex bg-muted/50 border-b border-border/40 p-4">
                        {Array.from({ length: columnsCount }).map((_, i) => (
                            <div key={i} className="flex-1 px-2">
                                <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
                            </div>
                        ))}
                    </div>
                    {/* Skeleton Body */}
                    <div className="divide-y divide-border/20">
                        {Array.from({ length: rowsCount }).map((_, rowIndex) => (
                            <div key={rowIndex} className="flex p-4">
                                {Array.from({ length: columnsCount }).map((_, colIndex) => (
                                    <div key={colIndex} className="flex-1 px-2">
                                        <Skeleton className="h-4 w-[80%] bg-muted/40" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}