import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import * as React from "react"
import { Table } from "@/components/table/data-table"
import { userColumns } from "./user-columns"

export type Transaction = {
    id: string
    user: string
    email: string
    phone: string
    amount: number
    status: 'Success' | 'Pending' | 'Failed'
    joinedDate: string
    plan: 'Premium' | 'Standard' | 'Free'
    category: 'Movie' | 'Music' | 'Live'
    lastLogin: string
    ipAddress: string
    device: 'Desktop' | 'Mobile' | 'Tablet'
    verified: boolean
}
const data: Transaction[] = [
    { id: '1', user: 'Alex Rivera', email: 'alex@vibe.com', phone: '+1 555-0101', amount: 49.00, status: 'Success', joinedDate: '2023-12-01', plan: 'Premium', category: 'Movie', lastLogin: '2m ago', ipAddress: '192.168.1.1', device: 'Desktop', verified: true },
    { id: '2', user: 'Jordan Smith', email: 'j@vibe.com', phone: '+1 555-0102', amount: 12.50, status: 'Pending', joinedDate: '2024-01-10', plan: 'Standard', category: 'Music', lastLogin: '1h ago', ipAddress: '172.16.254.1', device: 'Mobile', verified: true },
    { id: '3', user: 'Casey Knight', email: 'c@vibe.com', phone: '+1 555-0103', amount: 29.99, status: 'Success', joinedDate: '2024-01-15', plan: 'Premium', category: 'Live', lastLogin: 'Yesterday', ipAddress: '10.0.0.50', device: 'Tablet', verified: false },
    { id: '4', user: 'Taylor Bell', email: 't@vibe.com', phone: '+1 555-0104', amount: 99.00, status: 'Failed', joinedDate: '2023-11-20', plan: 'Free', category: 'Movie', lastLogin: '3d ago', ipAddress: '45.12.88.10', device: 'Desktop', verified: true },
    { id: '5', user: 'Morgan Lee', email: 'm@vibe.com', phone: '+1 555-0105', amount: 150.00, status: 'Success', joinedDate: '2023-10-05', plan: 'Premium', category: 'Movie', lastLogin: 'Just now', ipAddress: '192.168.1.44', device: 'Mobile', verified: true },
    { id: '6', user: 'Sasha Grey', email: 's@vibe.com', phone: '+1 555-0106', amount: 59.00, status: 'Success', joinedDate: '2024-01-20', plan: 'Premium', category: 'Live', lastLogin: '12h ago', ipAddress: '88.2.14.21', device: 'Desktop', verified: true },
]



import type { ColumnFiltersState, Row } from "@tanstack/react-table"
import { toast } from "sonner"
import { downloadCSV } from "@/lib/utils"

export function RecentActivityTable() {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
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
        // table.resetRowSelection() // Optional: clear selection after delete
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

    return (
        <Table.Root table={table}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center gap-4">
                        <Table.Search columnId="user" placeholder="Search subscribers..." />
                        <Table.FilterTabs columnId="plan" options={['All', 'Premium', 'Standard', 'Free']} />
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-4">
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
                {false ? (
                    <Table.Loading columnsCount={userColumns.length} rowsCount={6} />
                ) : (
                    <Table.Body columnsCount={userColumns.length} />
                )}
                <Table.Pagination />
            </div>
        </Table.Root>
    )
}