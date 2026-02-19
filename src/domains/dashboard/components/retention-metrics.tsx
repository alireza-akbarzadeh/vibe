import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "@/components/motion";

export function RetentionMetrics() {
	const metrics = [
		{ label: "Net Revenue Retention", value: "102%", trend: "+2.4%", up: true },
		{ label: "Churn Rate", value: "1.2%", trend: "-0.4%", up: false },
		{ label: "At Risk Revenue", value: "$2,400", trend: "+12%", up: true },
	];

	// Container variants for staggered entrance
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1, // Each card starts 0.1s after the previous
			},
		},
	};

	// Individual card variants
	const cardVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { type: "spring" as const, stiffness: 300, damping: 24 },
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="grid  gap-4"
		>
			{metrics.map((m) => (
				<motion.div
					key={m.label}
					variants={cardVariants}
					whileHover={{
						scale: 1.02,
						backgroundColor: "rgba(var(--card), 0.6)",
						borderColor: "rgba(var(--primary), 0.3)",
					}}
					whileTap={{ scale: 0.98 }}
					className="p-4 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-md cursor-pointer transition-colors duration-300"
				>
					<p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
						{m.label}
					</p>
					<div className="flex items-end justify-between mt-1">
						<h4 className="text-xl font-bold">{m.value}</h4>
						<motion.span
							initial={{ opacity: 0, x: -5 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 }}
							className={`text-[10px] font-medium flex items-center ${
								m.up ? "text-emerald-500" : "text-destructive"
							}`}
						>
							{m.up ? (
								<ArrowUpRight className="size-3 mr-0.5" />
							) : (
								<ArrowDownRight className="size-3 mr-0.5" />
							)}
							{m.trend}
						</motion.span>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}
