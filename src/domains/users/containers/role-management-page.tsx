import {
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import {
	Activity,
	Download,
	ExternalLink,
	Network,
	Search as SearchIcon,
	ShieldAlert,
	Trash2,
	UserPlus,
	X,
} from "lucide-react";
import * as React from "react";
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
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStaffWithAccess } from "../server/roles.functions";
import { UpdateStaffRole } from "./update-role";

const ROLES = [
	{
		id: "1",
		name: "Administrator",
		color: "text-rose-400",
		bg: "bg-rose-400/10",
	},
	{
		id: "2",
		name: "Security Officer",
		color: "text-amber-400",
		bg: "bg-amber-400/10",
	},
	{ id: "3", name: "Operator", color: "text-blue-400", bg: "bg-blue-400/10" },
	{
		id: "4",
		name: "Support Tier 1",
		color: "text-emerald-400",
		bg: "bg-emerald-400/10",
	},
];

export type StaffMember = {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	status: "online" | "offline" | "flagged";
	lastActive: string;
	ipAddress: string;
	activePerms: {
		[key: string]: "read" | "write" | null;
	};
};

// Global Filter Logic (defined outside to prevent re-renders)
const globalFilterFn = (
	row: Row<StaffMember>,
	_columnId: string,
	filterValue: string,
) => {
	const searchTerm = filterValue.toLowerCase();
	const { name, email, phone } = row.original;
	return (
		name.toLowerCase().includes(searchTerm) ||
		email.toLowerCase().includes(searchTerm) ||
		phone.toLowerCase().includes(searchTerm)
	);
};

export default function StaffAccessPage() {
	const [staff, setStaff] = React.useState<StaffMember[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [selectedId, setSelectedId] = React.useState<string | null>(null);
	const [rowSelection, setRowSelection] = React.useState({});
	const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);

	const activeStaff = staff.find((s) => s.id === selectedId);

	// Fetch staff data from API
	React.useEffect(() => {
		const fetchStaff = async () => {
			try {
				setIsLoading(true);
				const data = await getStaffWithAccess();
				setStaff(data);
			} catch (error) {
				toast.error("Failed to load staff members");
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchStaff();
	}, []);

	const handleExport = () => {
		const blob = new Blob([JSON.stringify(staff, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "personnel-manifest.json";
		a.click();
		toast.success("Identity manifest exported");
	};

	const handleBulkDelete = () => {
		const selectedIndices = Object.keys(rowSelection).map(Number);
		const idsToDelete = selectedIndices.map(
			(idx) => table.getRowModel().rows[idx].original.id,
		);
		setStaff((prev) => prev.filter((s) => !idsToDelete.includes(s.id)));
		setRowSelection({});
		toast.error(`${idsToDelete.length} personnel records purged`);
	};

	const handlePermissionToggle = (routeId: string, type: "read" | "write") => {
		setStaff((prev) =>
			prev.map((s) => {
				if (s.id !== selectedId) return s;
				const current = s.activePerms[routeId];
				let newValue: "read" | "write" | null = null;
				if (type === "read") newValue = current === "read" ? null : "read";
				else newValue = current === "write" ? null : "write";
				return { ...s, activePerms: { ...s.activePerms, [routeId]: newValue } };
			}),
		);
	};

	const columns = React.useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Personnel Identifier",
				cell: ({ row }: { row: Row<StaffMember> }) => (
					<div className="flex items-center gap-4">
						<div className="relative flex-shrink-0">
							<div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-black text-xs text-blue-400">
								{row.original.name.charAt(0)}
							</div>
							<div
								className={cn(
									"absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[#020617]",
									row.original.status === "online"
										? "bg-emerald-500"
										: row.original.status === "flagged"
											? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
											: "bg-slate-600",
								)}
							/>
						</div>
						<div className="flex flex-col min-w-0">
							<span className="font-bold text-white uppercase tracking-tight text-[11px] leading-tight truncate">
								{row.original.name}
							</span>
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5">
								<span className="text-[9px] text-slate-500 lowercase font-medium truncate">
									{row.original.email}
								</span>
								<span className="hidden sm:block size-1 rounded-full bg-white/10" />
								<span className="text-[9px] text-slate-600 font-mono tracking-tighter">
									{row.original.phone}
								</span>
							</div>
						</div>
					</div>
				),
			},
			{
				accessorKey: "role",
				header: "Clearance",
				cell: ({ row }: { row: Row<StaffMember> }) => {
					const role = ROLES.find((r) => r.name === row.original.role);
					return (
						<span
							className={cn(
								"px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-current/20 whitespace-nowrap",
								role?.color,
								role?.bg,
							)}
						>
							{row.original.role}
						</span>
					);
				},
			},
			{
				accessorKey: "network",
				header: "Network Identity",
				cell: ({ row }: { row: Row<StaffMember> }) => (
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500/80 tracking-tighter">
							<Network className="size-3 text-slate-600" />
							{row.original.ipAddress}
						</div>
						<div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase whitespace-nowrap">
							<Activity className="size-3" /> {row.original.lastActive}
						</div>
					</div>
				),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }: { row: Row<StaffMember> }) => (
					<Button
						variant="ghost"
						size="icon"
						className="size-8 hover:bg-white/5 text-slate-600 hover:text-white"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedId(row.original.id);
						}}
					>
						<ExternalLink className="size-4" />
					</Button>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: staff,
		columns,
		state: { columnFilters, rowSelection, globalFilter },
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: globalFilterFn,
		onColumnFiltersChange: setColumnFilters,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
			<Table.Root table={table}>
				<div className="flex flex-col w-full relative">
					{/* MOBILE SEARCH OVERLAY USING YOUR COMPONENT */}
					<div
						className={cn(
							"absolute inset-0 z-[60] bg-[#020617] flex items-center px-6 transition-all duration-300 md:hidden",
							isMobileSearchOpen
								? "translate-y-0 opacity-100"
								: "-translate-y-full opacity-0 pointer-events-none",
						)}
					>
						<div className="relative flex-1 flex items-center gap-2">
							<Table.Search
								placeholder="SEARCH NAME, EMAIL, PHONE..."
								className="h-14 rounded-2xl flex-1 uppercase font-bold tracking-widest text-sm"
								// No columnId = uses global filter automatically
							/>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-xl hover:bg-white/5"
								onClick={() => {
									setIsMobileSearchOpen(false);
									setGlobalFilter("");
								}}
							>
								<X className="size-6 text-slate-400" />
							</Button>
						</div>
					</div>

					{/* TOP BAR */}
					<div className="p-4 md:p-8 border-b border-white/5 space-y-6 md:space-y-8 bg-gradient-to-b from-blue-500/[0.02] to-transparent">
						<div className="flex justify-between items-start">
							<div
								className={cn(
									"transition-opacity",
									isMobileSearchOpen ? "opacity-0" : "opacity-100",
								)}
							>
								<h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
									Personnel Command
								</h1>
								<div className="hidden md:flex items-center gap-4 mt-2">
									<div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
										<div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
										System Operational
									</div>
									<div className="h-3 w-px bg-white/10" />
									<p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
										Manifest: {staff.length} IDs
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2 md:gap-3">
								<Button
									variant="outline"
									size="icon"
									className="md:hidden rounded-xl border-white/5 bg-white/5 h-10 w-10"
									onClick={() => setIsMobileSearchOpen(true)}
								>
									<SearchIcon className="size-4" />
								</Button>

								<Button
									variant="outline"
									className="hidden sm:flex rounded-xl border-white/5 bg-white/5 h-10 md:h-11 px-3 md:px-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest"
									onClick={handleExport}
								>
									<Download className="mr-2 size-4" /> Export
								</Button>
								<Button className="rounded-xl bg-blue-600 hover:bg-blue-500 h-10 md:h-11 px-4 md:px-6 font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg shadow-blue-900/20">
									<UserPlus className="sm:mr-2 size-4" />
									<span className="hidden sm:inline">Grant Access</span>
								</Button>
							</div>
						</div>

						{/* DESKTOP SEARCH & TABS */}
						<div className="flex flex-col md:flex-row md:items-center gap-4">
							<div className="hidden md:block flex-1">
								<Table.Search
									placeholder="SEARCH BY NAME, EMAIL, OR PHONE..."
									className="max-w-full text-[10px] font-bold uppercase tracking-widest"
								/>
							</div>

							<div className="w-full md:w-auto overflow-x-auto scrollbar-none pb-1 md:pb-0">
								<Table.FilterTabs
									columnId="role"
									options={["All", ...ROLES.map((r) => r.name)]}
								/>
							</div>

							{Object.keys(rowSelection).length > 0 && (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="destructive"
											className="h-10 rounded-xl px-4 text-[10px] font-black uppercase animate-in slide-in-from-bottom-2"
										>
											<Trash2 className="mr-2 size-4" /> Purge{" "}
											{Object.keys(rowSelection).length}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent className="bg-[#0d1117] border-white/10 text-white">
										<AlertDialogHeader>
											<AlertDialogTitle className="uppercase italic font-black">
												Confirm Purge
											</AlertDialogTitle>
											<AlertDialogDescription className="text-slate-400">
												Immediately revoke access and wipe records from the
												manifest.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel className="bg-white/5 border-none">
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleBulkDelete}
												className="bg-rose-600 hover:bg-rose-500"
											>
												Confirm
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
					</div>

					<div className="flex-1 p-4 md:p-6 overflow-hidden">
						{isLoading ? (
							<Table.Loading columnsCount={4} rowsCount={5} />
						) : (
							<Table.Body
								columnsCount={4}
								onRowDoubleClick={(row: Row<StaffMember>) =>
									setSelectedId(row.original.id)
								}
							/>
						)}
					</div>

					<div className="px-4 md:px-8 py-4 border-t border-white/5 bg-black/20 flex flex-col md:flex-row items-center justify-between gap-4">
						<Table.Pagination />
						<div className="flex items-center gap-2">
							<ShieldAlert className="size-4 text-rose-500" />
							<span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
								{staff.filter((s) => s.status === "flagged").length} Anomalies
								detected
							</span>
						</div>
					</div>
				</div>
			</Table.Root>

			<UpdateStaffRole
				activeStaff={activeStaff as StaffMember}
				handlePermissionToggle={handlePermissionToggle}
				selectedId={selectedId}
				setSelectedId={setSelectedId}
				setStaff={setStaff}
			/>
		</div>
	);
}
