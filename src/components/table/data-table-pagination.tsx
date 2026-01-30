import type { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const pageIndex = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()

    return (
        <div className="flex items-center justify-between px-2 py-2">
            {/* Left Side: Selection Info */}
            <div className="hidden sm:block text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
            </div>

            {/* Right Side: Navigation */}
            <div className="flex items-center gap-2 ml-auto">
                <span className="text-[11px] font-bold text-muted-foreground mr-2">
                    Page {pageIndex + 1} of {pageCount}
                </span>

                <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8 rounded-lg border-border/40 bg-card/40 hover:bg-background transition-colors"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    {/* Page Numbers (Smart Slice) */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                            // Basic logic to show pages around current index
                            let pageNum = i;
                            if (pageCount > 5 && pageIndex > 2) {
                                pageNum = Math.min(pageIndex - 2 + i, pageCount - 5 + i);
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={pageIndex === pageNum ? "secondary" : "ghost"}
                                    className={cn(
                                        "size-8 text-xs font-bold rounded-lg transition-all",
                                        pageIndex === pageNum ? "shadow-sm border border-primary/10" : ""
                                    )}
                                    onClick={() => table.setPageIndex(pageNum)}
                                >
                                    {pageNum + 1}
                                </Button>
                            )
                        })}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8 rounded-lg border-border/40 bg-card/40 hover:bg-background transition-colors"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}