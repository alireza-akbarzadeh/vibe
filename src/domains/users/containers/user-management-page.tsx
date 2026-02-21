import { Link } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orpc } from "@/orpc/client";
import { InviteUserForm } from "../components/invite-user-form";
import { UserStatCard } from "../components/user-status-card";
import { UserManagementTable } from "./user-table";

export default function UserManagementPage() {
	const [isInviteOpen, setIsInviteOpen] = React.useState(false);
	const [stats, setStats] = React.useState({
		totalUsers: 0,
		activeNow: 0,
		churnRate: 0,
		flaggedUsers: 0,
	});

	// Fetch user stats
	React.useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await client.users.getStats({});
				setStats(data);
			} catch (error) {
				console.error("Failed to load user stats:", error);
			}
		};
		fetchStats();
	}, []);

	const handleExport = () => {
		toast.promise(new Promise((res) => setTimeout(res, 1500)), {
			loading: "Preparing CSV export...",
			success: "User directory exported successfully",
			error: "Export failed",
		});
	};

	return (
		<div className="relative space-y-6 p-4 md:p-8 min-h-screen">
			{/* 1. Page Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-black tracking-tight italic uppercase">
						User Directory
					</h1>
					<p className="text-sm text-muted-foreground font-medium">
						Manage, verify, and monitor your global user base.
					</p>
				</div>

				<div className="flex items-center gap-2 overflow-x-auto">
					<Button
						variant="outline"
						onClick={handleExport}
						className="rounded-xl font-bold uppercase tracking-wider text-[10px] h-10 border-border/60"
					>
						<Download className="mr-2 h-3.5 w-3.5" /> Export
					</Button>

					<AppDialog
						open={isInviteOpen}
						onOpenChange={setIsInviteOpen}
						component="drawer"
						title="Invite New Member"
						description="Send an invitation link to a new user to join your organization."
						trigger={
							<Button
								variant="outline"
								className={cn(
									"h-10 px-6 rounded-xl",
									"bg-background/50 backdrop-blur-md border-border/60 font-black uppercase tracking-[0.15em] text-[10px]",
									"hover:bg-muted/50 hover:border-primary/50 hover:text-primary",
									"shadow-sm transition-all duration-300 group",
								)}
							>
								<Plus className="mr-2 h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
								Invite User
							</Button>
						}
					>
						<InviteUserForm onSuccess={() => setIsInviteOpen(false)} />
					</AppDialog>

					<Button
						asChild
						className={cn(
							"h-10 px-6 rounded-xl",
							"bg-primary text-primary-foreground font-black uppercase tracking-[0.15em] text-[10px]",
							"shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] hover:shadow-[0_0_25px_-3px_rgba(var(--primary),0.5)]",
							"border-t border-white/20 transition-all duration-300 active:scale-95 active:shadow-inner",
						)}
					>
						<Link to="/dashboard/users/create">
							<Plus className="mr-2 h-3.5 w-3.5 stroke-[3px]" />
							Create User
						</Link>
					</Button>
				</div>
			</div>

			{/* 2. Quick Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
				<UserStatCard
					label="Total Users"
					value={stats.totalUsers.toLocaleString()}
					change="+12%"
				/>
				<UserStatCard
					label="Active Now"
					value={stats.activeNow.toLocaleString()}
					pulse
				/>
				<UserStatCard
					label="Churn Rate"
					value={`${stats.churnRate}%`}
					color="text-emerald-500"
				/>
				<UserStatCard
					label="Flagged"
					value={stats.flaggedUsers.toString()}
					color="text-destructive"
				/>
			</div>

			{/* 3. The Main Table Area */}
			<div className="rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">
				<UserManagementTable />
			</div>
		</div>
	);
}
