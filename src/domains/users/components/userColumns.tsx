import type { ColumnDef } from "@tanstack/react-table";
import {
	CheckCircle2,
	Clock,
	CreditCard,
	Fingerprint,
	Globe,
	HardDrive,
	MapPin,
	ShieldAlert,
	ShieldCheck,
	Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { UserAccount } from "../server/users.functions";
import { UserActions } from "./user-actions";

export const userColumns: ColumnDef<UserAccount>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				className="translate-y-0.5 rounded-md border-muted-foreground/30"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				className="translate-y-0.5 rounded-md border-muted-foreground/30"
			/>
		),
	},
	// 1. IDENTITY & CONTACT
	{
		accessorKey: "name",
		id: "name", // Explicit ID for Table.Search
		header: "User Identity",
		cell: ({ row }) => {
			const { name, email, avatar, role, emailVerified, phone, phoneVerified } =
				row.original;
			return (
				<div className="flex items-center gap-3 py-1">
					<div className="relative shrink-0">
						<img
							src={avatar}
							alt={name}
							className="h-10 w-10 rounded-xl bg-muted border border-border/50 object-cover"
						/>
						{role !== "User" && (
							<div
								className={cn(
									"absolute -top-1 -right-1 rounded-full p-0.5 shadow-sm border border-background",
									role === "Admin"
										? "bg-primary text-primary-foreground"
										: "bg-blue-500 text-white",
								)}
							>
								<ShieldCheck className="h-2.5 w-2.5" />
							</div>
						)}
					</div>
					<div className="flex flex-col min-w-0 max-w-[180px]">
						<div className="flex items-center gap-1.5">
							<span className="text-sm font-bold truncate">{name}</span>
							{emailVerified && (
								<CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
							)}
						</div>
						<span className="text-[10px] text-muted-foreground truncate">
							{email}
						</span>
						{phone && (
							<span
								className={cn(
									"text-[9px] font-medium flex items-center gap-1",
									phoneVerified ? "text-emerald-600/70" : "text-amber-600/70",
								)}
							>
								<Smartphone className="h-2.5 w-2.5" /> {phone}
							</span>
						)}
					</div>
				</div>
			);
		},
	},
	// 2. LOCATION & LOCALE
	{
		accessorKey: "location",
		header: "Region",
		cell: ({ row }) => {
			const { city, country, locale, timezone } = row.original;
			return (
				<div className="flex flex-col gap-0.5 min-w-[100px]">
					<div className="flex items-center gap-1.5 text-xs font-semibold">
						<MapPin className="h-3 w-3 text-muted-foreground" />
						<span>
							{city || "N/A"}, {country}
						</span>
					</div>
					<div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-tight">
						<Globe className="h-2.5 w-2.5" /> {locale} •{" "}
						{timezone?.split("/").pop()}
					</div>
				</div>
			);
		},
	},
	// 3. SECURITY & DEVICES
	{
		accessorKey: "security",
		header: "Security Audit",
		cell: ({ row }) => {
			const { twoFactorEnabled, mfaMethods, devices, failedLoginAttempts } =
				row.original;
			return (
				<div className="flex items-center gap-3">
					<div className="flex -space-x-2">
						{mfaMethods?.map((method) => (
							<div
								key={method}
								className="h-7 w-7 rounded-full bg-background border-2 border-muted flex items-center justify-center shadow-sm"
							>
								{method === "authenticator" ? (
									<Fingerprint className="h-3.5 w-3.5 text-primary" />
								) : (
									<Smartphone className="h-3.5 w-3.5 text-blue-500" />
								)}
							</div>
						))}
						{!twoFactorEnabled && (
							<div className="h-7 w-7 rounded-full bg-destructive/10 border-2 border-background flex items-center justify-center">
								<ShieldAlert className="h-3.5 w-3.5 text-destructive" />
							</div>
						)}
					</div>
					<div className="flex flex-col">
						<span className="text-[10px] font-bold text-foreground">
							{devices?.length || 0} Connected
						</span>
						{failedLoginAttempts && failedLoginAttempts > 0 ? (
							<span className="text-[9px] font-black text-destructive uppercase tracking-tighter">
								{failedLoginAttempts} Failures
							</span>
						) : (
							<span className="text-[9px] text-emerald-500 font-bold">
								Secure
							</span>
						)}
					</div>
				</div>
			);
		},
	},
	// 4. USAGE & METRICS
	{
		accessorKey: "usage",
		header: "Account Metrics",
		cell: ({ row }) => {
			const { usage, storageUsedMB, streamingHours, profileComplete } =
				row.original;
			return (
				<div className="flex flex-col gap-1.5 w-[140px]">
					<div className="flex justify-between items-end">
						<div className="flex flex-col">
							<span className="text-[10px] font-black uppercase text-muted-foreground leading-none">
								Usage
							</span>
							<span className="text-[11px] font-bold">{usage}%</span>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-[8px] font-bold text-muted-foreground uppercase">
								Setup
							</span>
							<span className="text-[10px] font-bold text-primary">
								{profileComplete}%
							</span>
						</div>
					</div>
					<div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
						<div
							className={cn("h-full bg-primary")}
							style={{ width: `${profileComplete}%` }}
						/>
					</div>
					<div className="flex items-center justify-between text-[9px] text-muted-foreground font-medium">
						<span className="flex items-center gap-0.5">
							<HardDrive className="h-2.5 w-2.5" /> {storageUsedMB}MB
						</span>
						<span className="flex items-center gap-0.5">
							<Clock className="h-2.5 w-2.5" /> {streamingHours}h
						</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "joinedAt",
		id: "joinedAt",
		header: "Join Date",
		filterFn: "dateRange" as any,
		cell: ({ row }) => {
			const date = row.original.joinedAt;
			return (
				<div className="flex flex-col">
					<span className="text-[10px] font-bold">
						{date ? new Date(date).toLocaleDateString() : "N/A"}
					</span>
					<span className="text-[9px] text-muted-foreground uppercase font-medium">
						Original Member
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "subscriptionEnd",
		id: "subscriptionEnd",
		header: "Expiry",
		filterFn: "dateRange" as any,
		cell: ({ row }) => {
			const date = row.original.subscriptionEnd;
			return date ? (
				<span className="text-[10px] font-medium">
					{new Date(date).toLocaleDateString()}
				</span>
			) : (
				<span className="text-[10px] opacity-50">No End Date</span>
			);
		},
	},
	{
		accessorKey: "plan",
		id: "plan",
		header: "Plan & Billing",
		filterFn: "fuzzy" as any,
		cell: ({ row }) => {
			const { plan, billingStatus, accountBalance, credits, subscriptionEnd } =
				row.original;
			return (
				<div className="flex flex-col gap-1 min-w-[120px]">
					<div className="flex items-center gap-2">
						<Badge
							className={cn(
								"text-[9px] font-black uppercase px-1.5 py-0",
								plan === "Premium"
									? "bg-primary"
									: "bg-muted text-muted-foreground",
							)}
						>
							{plan}
						</Badge>
						<span
							className={cn(
								"text-[10px] font-bold uppercase",
								billingStatus === "active"
									? "text-emerald-600"
									: "text-destructive",
							)}
						>
							{billingStatus}
						</span>
					</div>
					<div className="flex flex-col text-[10px] font-medium text-muted-foreground leading-tight">
						<span className="flex items-center gap-1 text-foreground font-bold">
							<CreditCard className="h-3 w-3" /> ${accountBalance?.toFixed(2)}
						</span>
						<span>{credits} Credits</span>
						{subscriptionEnd && (
							<span className="text-[9px] opacity-70">
								Ends: {new Date(subscriptionEnd).toLocaleDateString()}
							</span>
						)}
					</div>
				</div>
			);
		},
	},
	// 6. STATUS & METADATA
	{
		accessorKey: "status",
		id: "status",
		header: "System Status",
		filterFn: "multiSelect" as any,
		cell: ({ row }) => {
			const { status, tags } = row.original;
			const config = {
				active: { color: "bg-emerald-500", label: "Active" },
				pending: { color: "bg-amber-500", label: "Pending" },
				suspended: { color: "bg-destructive", label: "Banned" },
				flagged: { color: "bg-orange-500", label: "Review" },
				deactivated: { color: "bg-muted-foreground", label: "Ghost" },
			}[status] || { color: "bg-muted", label: status };

			return (
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2">
						<div className={cn("h-2 w-2 rounded-full", config.color)} />
						<span className="text-xs font-bold uppercase tracking-tighter">
							{config.label}
						</span>
					</div>
					<div className="flex flex-wrap gap-1 max-w-[120px]">
						{tags?.slice(0, 2).map((tag) => (
							<span
								key={tag}
								className="text-[8px] px-1 bg-muted rounded font-bold text-muted-foreground"
							>
								#{tag}
							</span>
						))}
					</div>
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <UserActions user={row.original} />,
	},
];
