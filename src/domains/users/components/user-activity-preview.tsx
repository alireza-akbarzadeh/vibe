import { Globe, ShieldX, Smartphone } from "lucide-react";
import type { UserAccount } from "../server/users.functions";

export function UserActivityPreview({ user }: { user: UserAccount }) {
	return (
		<div className="space-y-4">
			{/* Connection Metadata */}
			<div className="flex items-center gap-4 p-3 rounded-2xl bg-primary/[0.03] border border-primary/10">
				<div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center shadow-sm">
					<Globe className="h-5 w-5 text-primary" />
				</div>
				<div className="flex flex-col">
					<span className="text-xs font-bold text-foreground">
						{user.city}, {user.country}
					</span>
					<span className="text-[10px] text-muted-foreground font-medium">
						{user.timezone} • IP: 192.168.1.1
					</span>
				</div>
			</div>

			{/* Audit Logs */}
			<div className="space-y-2">
				<span className="text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest">
					Recent Events
				</span>

				{/* Simulated Log Entries based on User Data */}
				<div className="relative pl-4 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
					<div className="relative flex flex-col gap-1">
						<div className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-background" />
						<span className="text-[11px] font-bold">Successful Login</span>
						<span className="text-[9px] text-muted-foreground flex items-center gap-1">
							<Smartphone className="h-2.5 w-2.5" /> Mobile App • 14 mins ago
						</span>
					</div>

					{Number(user.failedLoginAttempts) > 0 && (
						<div className="relative flex flex-col gap-1">
							<div className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-destructive ring-4 ring-background" />
							<span className="text-[11px] font-bold text-destructive">
								Failed Login Attempt
							</span>
							<span className="text-[9px] text-muted-foreground flex items-center gap-1">
								<ShieldX className="h-2.5 w-2.5" /> {user.failedLoginAttempts}{" "}
								attempts from unrecognized IP
							</span>
						</div>
					)}

					<div className="relative flex flex-col gap-1">
						<div className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
						<span className="text-[11px] font-bold">Plan Switch</span>
						<span className="text-[9px] text-muted-foreground italic">
							Upgraded to {user.plan}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
