"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table } from "@/components/table/data-table";
import { useAdminAllSubscriptions } from "@/hooks/useAdminPolar";
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";

type Subscription = {
    id: string;
    customerEmail: string | null;
    productName: string;
    status: string;
    amount: number;
    currency: string;
    interval: string | null;
    currentPeriodStart: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
};

const statusOptions = [
    { label: "Active", icon: CheckCircle2, color: "text-green-500" },
    { label: "Canceled", icon: XCircle, color: "text-red-500" },
    { label: "Trialing", icon: Clock, color: "text-blue-500" },
    { label: "Past Due", icon: AlertCircle, color: "text-orange-500" },
];

export function AdminSubscriptionsPage() {
    const { data, isLoading } = useAdminAllSubscriptions({
        page: 1,
        limit: 20,
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: "bg-green-500/10 text-green-500 border-green-500/20",
            canceled: "bg-red-500/10 text-red-500 border-red-500/20",
            trialing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            past_due: "bg-orange-500/10 text-orange-500 border-orange-500/20",
            unpaid: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        return colors[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
    };

    const columns: ColumnDef<Subscription>[] = [
        {
            accessorKey: "customerEmail",
            header: "Customer",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.customerEmail || "N/A"}</span>
            ),
        },
        {
            accessorKey: "productName",
            header: "Product",
            cell: ({ row }) => <span className="font-medium">{row.original.productName}</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge className={getStatusColor(row.original.status)}>
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) =>
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: row.original.currency,
                }).format(row.original.amount / 100),
        },
        {
            accessorKey: "interval",
            header: "Interval",
            cell: ({ row }) => (
                <span className="capitalize">{row.original.interval || "N/A"}</span>
            ),
        },
        {
            accessorKey: "currentPeriodEnd",
            header: "Period End",
            cell: ({ row }) =>
                row.original.currentPeriodEnd
                    ? new Date(row.original.currentPeriodEnd).toLocaleDateString()
                    : "N/A",
        },
    ];

    const table = useReactTable<Subscription>({
        data: (data?.subscriptions || []) as Subscription[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        filterFns: {
            multiSelect: (row, columnId, filterValue) => {
                if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0))
                    return true;
                const rowValue = String(row.getValue(columnId)).toLowerCase();
                if (Array.isArray(filterValue)) {
                    return filterValue.some((val) => String(val).toLowerCase() === rowValue);
                }
                return String(filterValue).toLowerCase() === rowValue;
            },
        },
    });

    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                <p className="text-muted-foreground">
                    Manage all user subscriptions across your platform
                </p>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Table.Root table={table}>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row items-center gap-3 px-6 py-5 bg-muted/5 border-b border-border/40 rounded-t-[2rem]">
                            <div className="flex-1 w-full md:w-auto">
                                <Table.Search
                                    columnId="customerEmail"
                                    placeholder="Search by customer email..."
                                />
                            </div>
                            <Table.StatusFilters
                                columnId="status"
                                title="Status"
                                options={statusOptions}
                            />
                        </div>

                        <div className="px-2">
                            <Table.Body<Subscription> columnsCount={6} />
                        </div>

                        <div className="px-6 py-4 border-t border-border/40">
                            <Table.Pagination />
                        </div>
                    </div>
                </Table.Root>
            )}
        </div>
    );
}
