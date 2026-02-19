import { cn } from "@/lib/utils";

export function UserStatCard({ label, value, change, pulse, color }: any) {
	return (
		<div className="p-5 rounded-2xl bg-muted/20 border border-border/40">
			<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
				{label}
			</p>
			<div className="flex items-center justify-between mt-2">
				<h3 className={cn("text-2xl font-bold", color)}>{value}</h3>
				{pulse && (
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
					</span>
				)}
				{change && (
					<span className="text-[10px] font-medium text-emerald-500">
						{change}
					</span>
				)}
			</div>
		</div>
	);
}
