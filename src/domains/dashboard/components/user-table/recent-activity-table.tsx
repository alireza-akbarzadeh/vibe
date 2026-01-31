import { useQuery } from "@tanstack/react-query"
import type { ColumnFiltersState, Row } from "@tanstack/react-table"
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { Table } from "@/components/table/data-table"
import { downloadCSV } from "@/lib/utils"
import { getTransactions } from "../../server/dashboard.functions"
import type { Transaction } from "../../server/mock-data"
import { userColumns } from "./user-columns"

export function RecentActivityTable() {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})


    const { data: allTransactions = [], isLoading, isError } = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
    });




    const table = useReactTable({
        data: allTransactions,
        columns: userColumns,
        state: { columnFilters, rowSelection },
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row.id,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const paymentStatuses = [
        { label: 'Success', icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Pending', icon: Clock, color: 'text-amber-500' },
        { label: 'Failed', icon: XCircle, color: 'text-destructive' }
    ]

    // Typed handlers using Row<Transaction>
    const handleDelete = (rows: Row<Transaction>[]) => {
        const selectedIds = rows.map(r => r.original.id)
        console.log("Deleting Transactions:", selectedIds)
        toast.success("Deleted", {
            description: `${rows.length} transaction(s) have been deleted.`
        })
    }

    const handleDownload = (rows: Row<Transaction>[]) => {
        const success = downloadCSV(rows, "subscribers-export");

        if (success) {
            toast.success("Download Started", {
                description: `${rows.length} rows exported to CSV successfully.`
            });
        } else {
            toast.error("Export Failed", {
                description: "There was an error generating your CSV file."
            });
        }
    }


    if (isError) return <div className="p-8 text-center text-destructive">Failed to load data.</div>
    return (
        <Table.Root table={table}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                        <Table.Search columnId="user" placeholder="Search subscribers..." />
                        <Table.FilterTabs columnId="plan" options={['All', 'Premium', 'Standard', 'Free']} />
                    </div>

                    <div className="flex items-center flex-wrap justify-between border-t border-border/40 pt-4">
                        <Table.StatusFilters
                            columnId="status"
                            title="Billing"
                            options={paymentStatuses}
                        />
                        <div className="flex items-center gap-3">
                            {/* BULK ACTIONS WITH DIALOG CONTENT */}
                            <Table.BulkActions
                                onDelete={handleDelete}
                                onDownload={handleDownload}
                                deleteTitle="Confirm Bulk Deletion"
                                deleteDescription="You are about to delete multiple transaction records. This action is permanent and cannot be reversed."
                            />

                            <div className="px-3 py-1.5 rounded-xl bg-muted/30 border border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {table.getFilteredRowModel().rows.length} Results Found
                            </div>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <Table.Loading columnsCount={userColumns.length} rowsCount={6} />
                ) : (
                    <Table.Body columnsCount={userColumns.length} />
                )}
                <Table.Pagination />
            </div>
        </Table.Root>
    )
}