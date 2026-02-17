import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	AlertCircle,
	Ban,
	CheckCircle2,
	Clock,
	Loader2,
	MoreHorizontal,
	XCircle,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Table } from "@/components/table/data-table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	useAdminAllSubscriptions,
	useAdminCancelSubscription,
	useAdminSubscriptionStats,
} from "@/hooks/useAdminPolar";
import { cn } from "@/lib/utils";

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

const STATUS_STYLES: Record<string, string> = {
	active: "bg-green-500/10 text-green-400 border-green-500/20",
	trialing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
	past_due: "bg-orange-500/10 text-orange-400 border-orange-500/20",
	canceled: "bg-red-500/10 text-red-400 border-red-500/20",
	unpaid: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusOptions = [
	{ label: "Active", icon: CheckCircle2, color: "text-green-500" },
	{ label: "Canceled", icon: XCircle, color: "text-red-500" },
	{ label: "Trialing", icon: Clock, color: "text-blue-500" },
	{ label: "Past Due", icon: AlertCircle, color: "text-orange-500" },
];

function formatCurrency(amount: number, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount / 100);
}

export function AdminSubscriptionsPage() {
	const [page] = useState(1);
	const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
	const [cancelReason, setCancelReason] = useState("");
	const cancelReasonId = useId();

	const { data, isLoading } = useAdminAllSubscriptions({
		page,
		limit: 25,
	});

	const { data: stats } = useAdminSubscriptionStats();
	const cancelMutation = useAdminCancelSubscription();

	const handleCancel = () => {
		if (!cancelTarget) return;
		cancelMutation.mutate(
			{
				subscriptionId: cancelTarget.id,
				reason: cancelReason || undefined,
			},
			{
				onSuccess: (result) => {
					toast.success(result.message);
					setCancelTarget(null);
					setCancelReason("");
				},
				onError: () => {
					toast.error("Failed to cancel subscription");
				},
			},
		);
	};

	const columns: ColumnDef<Subscription>[] = [
		{
			accessorKey: "customerEmail",
			header: "Customer",
			cell: ({ row }) => (
				<div>
					<span className="font-medium text-sm">
						{row.original.customerEmail || "N/A"}
					</span>
				</div>
			),
		},
		{
			accessorKey: "productName",
			header: "Plan",
			cell: ({ row }) => (
				<span className="font-medium text-sm">{row.original.productName}</span>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => (
				<Badge
					variant="outline"
					className={cn(
						"text-xs capitalize",
						STATUS_STYLES[row.original.status] ||
							"bg-gray-500/10 text-gray-400",
					)}
				>
					{row.original.status}
					{row.original.cancelAtPeriodEnd &&
						row.original.status === "active" && (
							<span className="ml-1">(ending)</span>
						)}
				</Badge>
			),
		},
		{
			accessorKey: "amount",
			header: "Amount",
			cell: ({ row }) =>
				formatCurrency(row.original.amount, row.original.currency),
		},
		{
			accessorKey: "interval",
			header: "Cycle",
			cell: ({ row }) => (
				<span className="capitalize text-sm text-muted-foreground">
					{row.original.interval || "—"}
				</span>
			),
		},
		{
			accessorKey: "currentPeriodEnd",
			header: "Period End",
			cell: ({ row }) =>
				row.original.currentPeriodEnd
					? new Date(row.original.currentPeriodEnd).toLocaleDateString()
					: "—",
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => {
				const sub = row.original;
				const canCancel =
					sub.status === "active" ||
					sub.status === "trialing" ||
					sub.status === "past_due";

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
									navigator.clipboard.writeText(sub.id);
									toast.success("Subscription ID copied");
								}}
							>
								Copy Subscription ID
							</DropdownMenuItem>
							{sub.customerEmail && (
								<DropdownMenuItem
									onClick={() => {
										navigator.clipboard.writeText(sub.customerEmail ?? "");
										toast.success("Email copied");
									}}
								>
									Copy Email
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							{canCancel && (
								<DropdownMenuItem
									className="text-red-400 focus:text-red-400"
									onClick={() => setCancelTarget(sub)}
								>
									<Ban className="w-3.5 h-3.5 mr-2" />
									Cancel Subscription
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
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
				if (
					!filterValue ||
					(Array.isArray(filterValue) && filterValue.length === 0)
				)
					return true;
				const rowValue = String(row.getValue(columnId)).toLowerCase();
				if (Array.isArray(filterValue)) {
					return filterValue.some(
						(val) => String(val).toLowerCase() === rowValue,
					);
				}
				return String(filterValue).toLowerCase() === rowValue;
			},
		},
	});

	return (
		<div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
					<p className="text-muted-foreground text-sm">
						Manage all user subscriptions across your platform
					</p>
				</div>
				{stats && (
					<div className="flex items-center gap-3 text-sm text-muted-foreground">
						<span>
							<span className="font-semibold text-foreground">
								{stats.activeSubscriptions}
							</span>{" "}
							active
						</span>
						<span className="text-border">•</span>
						<span>
							<span className="font-semibold text-foreground">
								{formatCurrency(stats.totalMrr, stats.currency)}
							</span>{" "}
							MRR
						</span>
					</div>
				)}
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
							<Table.Body<Subscription> columnsCount={7} />
						</div>

						<div className="px-6 py-4 border-t border-border/40">
							<Table.Pagination />
						</div>
					</div>
				</Table.Root>
			)}

			{/* Cancel Dialog */}
			<AlertDialog
				open={!!cancelTarget}
				onOpenChange={(open) => {
					if (!open) {
						setCancelTarget(null);
						setCancelReason("");
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<Ban className="w-5 h-5 text-red-400" />
							Cancel Subscription
						</AlertDialogTitle>
						<AlertDialogDescription className="space-y-3">
							<p>
								Are you sure you want to cancel the subscription for{" "}
								<strong>{cancelTarget?.customerEmail || "this user"}</strong> (
								{cancelTarget?.productName})?
							</p>
							<p className="text-xs text-muted-foreground">
								The subscription will remain active until the end of the current
								billing period.
							</p>
							<div>
								<label
									htmlFor={cancelReasonId}
									className="text-xs font-medium text-foreground mb-1 block"
								>
									Reason (optional)
								</label>
								<Input
									id={cancelReasonId}
									placeholder="e.g. Customer requested via support"
									value={cancelReason}
									onChange={(e) => setCancelReason(e.target.value)}
									className="mt-1"
								/>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={cancelMutation.isPending}>
							Keep Active
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleCancel}
							disabled={cancelMutation.isPending}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{cancelMutation.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Cancelling...
								</>
							) : (
								"Cancel Subscription"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
