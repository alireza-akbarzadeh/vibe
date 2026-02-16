
import {
    type ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Loader2, User } from "lucide-react";
import { Table } from "@/components/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminAllCustomers } from "@/hooks/useAdminPolar";

type Customer = {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
};

export function AdminCustomersPage() {
    const { data, isLoading } = useAdminAllCustomers({
        page: 1,
        limit: 20,
    });

    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <span className="font-medium">{row.original.email}</span>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span>{row.original.name || "—"}</span>,
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) =>
                new Date(row.original.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.id.slice(0, 8)}...
                </span>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.customers || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground">
                        View all customers who have subscribed to your platform
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{data?.total || 0} total customers</span>
                </div>
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
                        <div className="flex items-center justify-between px-6 py-5 bg-muted/5 border-b border-border/40 rounded-t-[2rem]">
                            <Table.Search
                                columnId="email"
                                placeholder="Search by email or name..."
                            />
                            <div className="text-sm text-muted-foreground">
                                {table.getFilteredRowModel().rows.length} Customers
                            </div>
                        </div>

                        <div className="px-2">
                            <Table.Body<Customer> columnsCount={4} />
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
