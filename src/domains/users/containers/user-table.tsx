import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import {
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import {
	AlertTriangle,
	ChevronDown,
	Clock,
	Filter,
	SlidersHorizontal,
	UserCheck,
	UserMinus,
	X,
} from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { AppDialog } from "@/components/app-dialog";
import { Table } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCSV } from "@/lib/utils";
import { AdvancedFilterContent } from "../components/advanced-filter-content";
import { userColumns } from "../components/userColumns";
import type { UserAccount } from "../server/users.functions";
import { fetchUsersAction, userUIStore } from "../user.store";

export function UserManagementTable() {
	const { users, isLoading, error } = useStore(userUIStore);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [rowSelection, setRowSelection] = React.useState({});

	const navigate = useNavigate();

	React.useEffect(() => {
		fetchUsersAction();
	}, []);

	// 1. Segment Handler - Updated to include potential date-based segments
	const applySegment = (segment: "all" | "new" | "power" | "risk") => {
		switch (segment) {
			case "new":
				// Filter for Pending status OR could be joinedAt in last 7 days
				setColumnFilters([{ id: "status", value: ["Pending"] }]);
				break;
			case "power":
				setColumnFilters([{ id: "plan", value: "Premium" }]);
				break;
			case "risk":
				setColumnFilters([{ id: "status", value: ["Flagged", "Suspended"] }]);
				break;
			default:
				setColumnFilters([]);
		}
		toast.success(`Switched to ${segment} segment`);
	};

	const table = useReactTable({
		data: users,
		columns: userColumns,
		state: { columnFilters, rowSelection },
		onColumnFiltersChange: setColumnFilters,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		filterFns: {
			multiSelect: (row, columnId, filterValue) => {
				if (
					!filterValue ||
					filterValue === "" ||
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
			fuzzy: (row, columnId, value) => {
				const itemValue = String(row.getValue(columnId)).toLowerCase();
				const filterValue = String(value).toLowerCase();
				return filterValue === "" || itemValue.includes(filterValue);
			},
			// NEW: Robust Date Range Filtering
			dateRange: (row, columnId, value) => {
				const rowValue = row.getValue(columnId);
				if (!rowValue || !value) return true;

				const date = new Date(rowValue as string | number | Date);
				const { from, to } = value as DateRange;

				if (from && to) {
					return date >= from && date <= to;
				}
				if (from) {
					return date >= from;
				}
				return true;
			},
		},
	});

	const userStatusOptions = [
		{ label: "Active", icon: UserCheck, color: "text-emerald-500" },
		{ label: "Pending", icon: Clock, color: "text-amber-500" },
		{ label: "Suspended", icon: UserMinus, color: "text-destructive" },
		{ label: "Flagged", icon: AlertTriangle, color: "text-orange-500" },
	];

	const handleDelete = (rows: Row<UserAccount>[]) => {
		toast.error(`Suspending ${rows.length} users`);
	};

	const handleDownload = (rows: Row<UserAccount>[]) => {
		downloadCSV(rows, "users-export");
		toast.success("Download Started");
	};

	if (error)
		return (
			<div className="p-16 text-center border-2 border-dashed rounded-[2rem]">
				<AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
				<h3 className="font-bold text-lg italic uppercase tracking-tight">
					Sync Error
				</h3>
				<p className="text-muted-foreground text-sm font-medium">{error}</p>
			</div>
		);

	return (
		<Table.Root table={table}>
			<div className="space-y-0">
				{/* 1. COMMAND BAR */}
				<div className="flex flex-col md:flex-row items-center gap-3 px-6 py-5 bg-muted/5 border-b border-border/40">
					<div className="flex-1 w-full md:w-auto">
						<Table.Search
							columnId="name"
							placeholder="Search identities by name or email..."
						/>
					</div>

					<div className="flex items-center gap-2 w-full md:w-auto">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-10 rounded-xl gap-2 text-[10px] font-bold uppercase border-dashed border-border/60 hover:bg-background"
								>
									<Filter className="h-3.5 w-3.5 text-primary" />
									Segment: {columnFilters.length > 0 ? "Custom" : "All"}
									<ChevronDown className="h-3 w-3 opacity-50" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-48 rounded-xl p-1 shadow-2xl border-border/40"
							>
								<DropdownMenuItem
									onClick={() => applySegment("all")}
									className="text-[10px] font-bold uppercase py-2"
								>
									All Users
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => applySegment("new")}
									className="text-[10px] font-bold uppercase py-2 text-amber-600"
								>
									New Signups
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => applySegment("power")}
									className="text-[10px] font-bold uppercase py-2 text-primary"
								>
									Power Users
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => applySegment("risk")}
									className="text-[10px] font-bold uppercase py-2 text-destructive"
								>
									At Risk
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<AppDialog
							component="drawer"
							title="Advanced Parameters"
							description="Filter by Registration Date, Expiry, and Usage metrics."
							trigger={
								<Button
									variant="outline"
									size="sm"
									className="h-10 rounded-xl gap-2 text-[10px] font-bold uppercase hover:bg-background"
								>
									<SlidersHorizontal className="h-3.5 w-3.5" />
									Advanced
									{columnFilters.length > 0 && (
										<span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
											{columnFilters.length}
										</span>
									)}
								</Button>
							}
						>
							<AdvancedFilterContent
								onApply={setColumnFilters}
								currentFilters={columnFilters}
							/>
						</AppDialog>

						<div className="h-4 w-[1px] bg-border mx-2 hidden md:block" />

						<Table.FilterTabs
							columnId="plan"
							options={["All", "Premium", "Standard", "Free"]}
						/>

						{columnFilters.length > 0 && (
							<Button
								variant="ghost"
								onClick={() => setColumnFilters([])}
								className="h-10 rounded-xl px-3 text-[10px] font-black uppercase text-destructive hover:bg-destructive/5"
							>
								<X className="h-3.5 w-3.5 mr-1" /> Reset
							</Button>
						)}
					</div>
				</div>

				{/* 2. SUB-BAR */}
				<div className="flex items-center justify-between px-6 py-4 bg-background/50 border-b border-border/40">
					<Table.StatusFilters
						columnId="status"
						title="Account Status"
						options={userStatusOptions}
					/>

					<div className="flex items-center gap-3">
						<Table.BulkActions
							onDelete={handleDelete}
							onDownload={handleDownload}
							deleteTitle="Confirm Suspension"
							deleteDescription="This will revoke access for all selected accounts immediately."
						/>
						<div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest leading-none">
							{table.getFilteredRowModel().rows.length} Results
						</div>
					</div>
				</div>

				{/* 3. TABLE BODY */}
				<div className="p-2">
					{isLoading ? (
						<Table.Loading columnsCount={8} rowsCount={10} />
					) : (
						<Table.Body<UserAccount>
							onRowDoubleClick={(row) =>
								navigate({
									to: "/dashboard/users/edit",
									search: { userId: row.original.id },
								})
							}
							columnsCount={8}
						/>
					)}
				</div>

				{/* 4. PAGINATION */}
				<div className="px-6 py-4 border-t border-border/40">
					<Table.Pagination />
				</div>
			</div>
		</Table.Root>
	);
}
