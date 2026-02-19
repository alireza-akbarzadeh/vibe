import {
	Activity,
	CircleDashed,
	History,
	Search,
	Settings,
	Shield,
	ShieldCheck,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CompactSelect } from "@/components/table/compact-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { StaffMember } from "./role-management-page";

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

const SYSTEM_ROUTES = [
	{ id: "r1", label: "User Management", category: "Core" },
	{ id: "r2", label: "Financial Audit", category: "Finance" },
	{ id: "r3", label: "API Configuration", category: "Infrastructure" },
	{ id: "r4", label: "System Logs", category: "Security" },
	{ id: "r5", label: "Database Access", category: "Infrastructure" },
	{ id: "r6", label: "Billing/Invoices", category: "Finance" },
	{ id: "r7", label: "Security Policies", category: "Security" },
	{ id: "r8", label: "Network Topology", category: "Infrastructure" },
	{ id: "r9", label: "External Integrations", category: "Core" },
	{ id: "r10", label: "Internal Messaging", category: "Core" },
	{ id: "r11", label: "Backup & Recovery", category: "Infrastructure" },
	{ id: "r12", label: "Metadata Editing", category: "Core" },
	{ id: "r13", label: "Auth Providers", category: "Security" },
	{ id: "r14", label: "Global Settings", category: "Core" },
	{ id: "r15", label: "Webhooks", category: "Infrastructure" },
];

interface UpdateStaffRoleProps {
	selectedId: string | null;
	setSelectedId: (id: string | null) => void;
	activeStaff: StaffMember;
	handlePermissionToggle: (routeId: string, level: "read" | "write") => void;
	setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
}

export function UpdateStaffRole({
	selectedId,
	setSelectedId,
	activeStaff,
	handlePermissionToggle,
	setStaff,
}: UpdateStaffRoleProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// Filtered routes based on search
	const filteredRoutes = useMemo(() => {
		return SYSTEM_ROUTES.filter(
			(r) =>
				r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
				r.category.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [searchQuery]);

	// Calculate stats
	const writeCount = Object.values(activeStaff?.activePerms || {}).filter(
		(v) => v === "write",
	).length;
	const readCount = Object.values(activeStaff?.activePerms || {}).filter(
		(v) => v !== null,
	).length;

	const resetPermissions = () => {
		setStaff((prev) =>
			prev.map((s) => (s.id === selectedId ? { ...s, activePerms: {} } : s)),
		);
		toast.error("All manual overrides cleared");
	};

	return (
		<Sheet
			open={!!selectedId}
			onOpenChange={(open) => !open && setSelectedId(null)}
		>
			<SheetContent
				side="right"
				className="w-[550px] sm:w-[650px] bg-[#020617] border-l border-white/10 p-0 text-slate-200 shadow-2xl flex flex-col outline-none"
			>
				{/* HEADER: Security Status */}
				<div className="p-8 border-b border-white/5 bg-[#0d1117]/50 backdrop-blur-md">
					<SheetHeader className="space-y-4">
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
									<ShieldCheck className="size-6" />
								</div>
								<div>
									<SheetTitle className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
										Access Matrix
									</SheetTitle>
									<p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
										Personnel ID: {selectedId?.slice(0, 8)}
									</p>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="icon"
									className="rounded-xl border-white/5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 group"
									onClick={resetPermissions}
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						</div>

						{/* ANALYTICS SLICE */}
						<div className="grid grid-cols-3 gap-3">
							<div className="bg-[#020617] p-3 rounded-2xl border border-white/5">
								<p className="text-[8px] font-black text-slate-500 uppercase">
									Coverage
								</p>
								<p className="text-sm font-bold text-white">
									{Math.round((readCount / SYSTEM_ROUTES.length) * 100)}%
								</p>
							</div>
							<div className="bg-[#020617] p-3 rounded-2xl border border-white/5">
								<p className="text-[8px] font-black text-slate-500 uppercase">
									Write Slices
								</p>
								<p className="text-sm font-bold text-emerald-400">
									{writeCount}
								</p>
							</div>
							<div className="bg-[#020617] p-3 rounded-2xl border border-white/5">
								<p className="text-[8px] font-black text-slate-500 uppercase">
									Status
								</p>
								<div className="flex items-center gap-1.5 mt-0.5">
									<div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
									<span className="text-[10px] font-bold text-slate-300 uppercase">
										Active
									</span>
								</div>
							</div>
						</div>
					</SheetHeader>
				</div>

				{/* CONTENT AREA */}
				<div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
					{/* ROLE CONFIG */}
					<section className="space-y-4">
						<div className="flex items-center gap-2 mb-2">
							<Activity className="size-3 text-slate-500" />
							<Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
								Inherited Authority
							</Label>
						</div>
						<CompactSelect
							label="Role"
							Icon={Shield}
							baseStyles="bg-[#0d1117] border-white/5 rounded-2xl h-14 px-6 focus-within:border-blue-500/50 transition-all"
							props={{
								options: ROLES,
								getOptionLabel: (r) => r.name,
								getOptionValue: (r) => r.name,
							}}
							field={{
								state: { value: activeStaff?.role },
								handleChange: (val) => {
									setStaff((prev) =>
										prev.map((s) =>
											s.id === selectedId ? { ...s, role: val } : s,
										),
									);
									toast.success(`Security level raised to ${val}`);
								},
							}}
						/>
					</section>

					{/* PERMISSION MATRIX */}
					<section className="space-y-6">
						<div className="flex flex-col gap-4">
							<div className="flex justify-between items-end px-1">
								<div className="flex items-center gap-2">
									<Settings className="size-3 text-blue-500" />
									<h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
										Route Overrides
									</h3>
								</div>
								<div className="flex gap-10 text-[9px] font-black uppercase text-slate-600 mr-2">
									<span>Read</span>
									<span>Write</span>
								</div>
							</div>

							{/* SEARCH BAR */}
							<div className="relative group">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
								<Input
									placeholder="SEARCH SYSTEM ROUTES..."
									className="bg-[#0d1117] border-white/5 pl-11 h-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:ring-blue-500/20"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						<div className="rounded-[2rem] border border-white/5 bg-[#0d1117]/30 divide-y divide-white/5 overflow-hidden">
							{filteredRoutes.length > 0 ? (
								filteredRoutes.map((route) => {
									const perm = activeStaff?.activePerms[route.id];
									return (
										<div
											key={route.id}
											className="flex items-center justify-between p-4 px-6 hover:bg-white/[0.02] transition-colors group/row"
										>
											<div className="flex flex-col">
												<div className="flex items-center gap-2">
													<span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight group-hover/row:text-blue-400 transition-colors">
														{route.label}
													</span>
													<span className="px-1.5 py-0.5 rounded bg-white/5 text-[7px] font-black text-slate-500 uppercase tracking-tighter">
														{route.category}
													</span>
												</div>
												<span className="text-[8px] font-mono text-slate-600 mt-0.5 uppercase tracking-tighter">
													Path: /sys/api/{route.id}
												</span>
											</div>

											<div className="flex items-center gap-10">
												<Checkbox
													checked={perm === "read" || perm === "write"}
													onCheckedChange={() =>
														handlePermissionToggle(route.id, "read")
													}
													className="size-5 rounded-lg border-white/10 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all"
												/>
												<Checkbox
													checked={perm === "write"}
													onCheckedChange={() =>
														handlePermissionToggle(route.id, "write")
													}
													className="size-5 rounded-lg border-white/10 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
												/>
											</div>
										</div>
									);
								})
							) : (
								<div className="p-10 text-center space-y-2">
									<CircleDashed className="size-6 text-slate-700 mx-auto animate-spin" />
									<p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
										No matching routes found
									</p>
								</div>
							)}
						</div>
					</section>

					{/* AUDIT LOG PREVIEW */}
					<section className="bg-blue-500/5 rounded-[2rem] p-6 border border-blue-500/10 space-y-4">
						<div className="flex items-center gap-2">
							<History className="size-3 text-blue-400" />
							<h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
								Change Log
							</h4>
						</div>
						<div className="space-y-3">
							<div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tight">
								<span className="text-slate-500 italic">2026-01-31 08:30</span>
								<span className="text-slate-300">Modified by Root-Admin</span>
							</div>
							<div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tight opacity-50">
								<span className="text-slate-500 italic">2026-01-28 14:12</span>
								<span className="text-slate-300">Initialized Personnel</span>
							</div>
						</div>
					</section>
				</div>

				{/* FOOTER ACTION */}
				<div className="p-8 bg-[#0d1117] border-t border-white/5 flex gap-4 backdrop-blur-md">
					<Button
						onClick={() => setSelectedId(null)}
						className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/40 border-t border-white/10 transition-all active:scale-[0.98]"
					>
						Synchronize Matrix
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
