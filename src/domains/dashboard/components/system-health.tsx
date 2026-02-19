import { motion } from "framer-motion";
import { Activity, Cpu, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

export function SystemHealth({ isCollapsed }: { isCollapsed: boolean }) {
	const stats = {
		cpu: 42,
		storage: 78,
		status: "Operational",
	};

	if (isCollapsed) {
		return (
			<div className="flex flex-col items-center gap-4 py-4 border-t border-border/20">
				<div className="relative">
					<Activity className="size-4 text-emerald-500" />
					<span className="absolute -top-1 -right-1 flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 mx-2 mb-2 rounded-2xl bg-muted/20 border border-border/30 backdrop-blur-sm">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
					<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
						System Status
					</span>
				</div>
				<span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
					{stats.status}
				</span>
			</div>

			<div className="space-y-3">
				{/* CPU Load */}
				<div className="space-y-1.5">
					<div className="flex items-center justify-between text-[10px] font-medium">
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<Cpu className="size-3" />
							<span>Server Load</span>
						</div>
						<span className="font-mono">{stats.cpu}%</span>
					</div>
					<div className="h-1 w-full bg-muted rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${stats.cpu}%` }}
							className={cn(
								"h-full rounded-full transition-colors duration-500",
								stats.cpu > 80 ? "bg-amber-500" : "bg-primary",
							)}
						/>
					</div>
				</div>

				{/* Storage */}
				<div className="space-y-1.5">
					<div className="flex items-center justify-between text-[10px] font-medium">
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<HardDrive className="size-3" />
							<span>Cloud Storage</span>
						</div>
						<span className="font-mono">{stats.storage}%</span>
					</div>
					<div className="h-1 w-full bg-muted rounded-full overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${stats.storage}%` }}
							className="h-full bg-emerald-500 rounded-full"
						/>
					</div>
				</div>
			</div>

			<p className="mt-3 text-[9px] text-muted-foreground/60 leading-tight text-center">
				Last sync: Just now
			</p>
		</div>
	);
}
