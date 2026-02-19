import { motion } from "framer-motion";
import { DollarSign, PlayCircle, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
	{
		label: "Total Revenue",
		value: "$45,231.89",
		trend: "+20.1%",
		icon: DollarSign,
		color: "text-emerald-500",
	},
	{
		label: "Active Subs",
		value: "+2350",
		trend: "+180.1%",
		icon: Users,
		color: "text-blue-500",
	},
	{
		label: "Watch Time",
		value: "1.2M min",
		trend: "+12.5%",
		icon: PlayCircle,
		color: "text-purple-500",
	},
	{
		label: "Avg Session",
		value: "45m",
		trend: "-2.4%",
		icon: TrendingUp,
		color: "text-amber-500",
	},
];

export function StatCards() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat, i) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: i * 0.1 }}
					className="relative overflow-hidden rounded-2xl border bg-card/50 p-6 backdrop-blur-sm"
				>
					<div className="flex items-center justify-between">
						<stat.icon className={cn("h-5 w-5", stat.color)} />
						<span
							className={cn(
								"text-xs font-bold px-2 py-0.5 rounded-full bg-muted",
								stat.trend.startsWith("+")
									? "text-emerald-500"
									: "text-destructive",
							)}
						>
							{stat.trend}
						</span>
					</div>
					<div className="mt-4">
						<h3 className="text-sm font-medium text-muted-foreground">
							{stat.label}
						</h3>
						<p className="text-2xl font-bold tracking-tight">{stat.value}</p>
					</div>
					{/* Decorative Background Glow */}
					<div
						className={cn(
							"absolute -right-4 -bottom-4 opacity-5 h-24 w-24 rounded-full blur-3xl",
							stat.color.replace("text", "bg"),
						)}
					/>
				</motion.div>
			))}
		</div>
	);
}
