import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Copy,
	ExternalLink,
	Loader2,
	MoreHorizontal,
	User,
	Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Table } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useAdminAllCustomers,
	useAdminSubscriptionStats,
} from "@/hooks/useAdminPolar";

type Customer = {
	id: string;
	email: string;
	name: string | null;
	createdAt: string;
};

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function daysSince(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function AdminCustomersPage() {
	const [page] = useState(1);
	const { data, isLoading } = useAdminAllCustomers({
		page,
		limit: 25,
	});
	const { data: stats } = useAdminSubscriptionStats();

	const columns: ColumnDef<Customer>[] = [
		{
			accessorKey: "email",
			header: "Customer",
			cell: ({ row }) => (
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
						<User className="h-4 w-4" />
					</div>
					<div className="min-w-0">
						<span className="font-medium text-sm block truncate">
							{row.original.email}
						</span>
						{row.original.name && (
							<span className="text-xs text-muted-foreground block truncate">
								{row.original.name}
							</span>
						)}
					</div>
				</div>
			),
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<span className="text-sm">{row.original.name || "—"}</span>
			),
		},
		{
			accessorKey: "createdAt",
			header: "Joined",
			cell: ({ row }) => {
				const days = daysSince(row.original.createdAt);
				return (
					<div>
						<span className="text-sm">
							{formatDate(row.original.createdAt)}
						</span>
						<span className="block text-xs text-muted-foreground">
							{days === 0
								? "Today"
								: days === 1
									? "Yesterday"
									: `${days} days ago`}
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: "id",
			header: "Customer ID",
			cell: ({ row }) => (
				<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
					{row.original.id.slice(0, 12)}...
				</code>
			),
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => {
				const customer = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									navigator.clipboard.writeText(customer.id);
									toast.success("Customer ID copied");
								}}
							>
								<Copy className="w-3.5 h-3.5 mr-2" />
								Copy Customer ID
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									navigator.clipboard.writeText(customer.email);
									toast.success("Email copied");
								}}
							>
								<Copy className="w-3.5 h-3.5 mr-2" />
								Copy Email
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<a
									href={`https://dashboard.polar.sh/customers/${customer.id}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="w-3.5 h-3.5 mr-2" />
									View in Polar
								</a>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
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
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Customers</h1>
					<p className="text-muted-foreground text-sm">
						View and manage all customers who have subscribed to your platform
					</p>
				</div>
				<div className="flex items-center gap-4 text-sm">
					<div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
						<Users className="h-4 w-4 text-primary" />
						<span className="text-muted-foreground">Total:</span>
						<span className="font-semibold">{data?.total || 0}</span>
					</div>
					{stats && (
						<div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
							<User className="h-4 w-4 text-green-500" />
							<span className="text-muted-foreground">Paid:</span>
							<span className="font-semibold">{stats.paidUserCount}</span>
						</div>
					)}
				</div>
			</div>

			{/* Table */}
			{isLoading ? (
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					</CardContent>
				</Card>
			) : (data?.customers?.length || 0) === 0 ? (
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
							<p className="text-lg font-medium">No customers yet</p>
							<p className="text-sm text-muted-foreground mt-1 max-w-sm">
								Customers will appear here once users subscribe to a paid plan
								on your platform.
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<Table.Root table={table}>
					<div className="space-y-4">
						<div className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 py-5 bg-muted/5 border-b border-border/40 rounded-t-[2rem]">
							<div className="flex-1 w-full md:w-auto">
								<Table.Search
									columnId="email"
									placeholder="Search by email..."
								/>
							</div>
							<div className="text-sm text-muted-foreground">
								{table.getFilteredRowModel().rows.length} customers
							</div>
						</div>

						<div className="px-2">
							<Table.Body<Customer> columnsCount={5} />
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
