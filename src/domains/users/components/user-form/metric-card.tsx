import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
	icon: Icon,
	label,
	value,
	color,
}: {
	icon: LucideIcon;
	label: string;
	value: string | number;
	color: "blue" | "green" | "purple" | "orange";
}) {
	const colorClasses = {
		blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
		green: "bg-green-500/10 text-green-600 border-green-500/20",
		purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
		orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
	};

	return (
		<div className="p-4 rounded-xl border bg-card space-y-2">
			<div
				className={cn(
					"w-8 h-8 rounded-lg flex items-center justify-center",
					colorClasses[color],
				)}
			>
				<Icon className="h-4 w-4" />
			</div>
			<p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
				{label}
			</p>
			<p className="text-xl font-mono font-bold">{value}</p>
		</div>
	);
}
