import { motion } from "@/components/motion";
import { cn } from "@/lib/utils";

export function GeoDistribution() {
	const regions = [
		{ name: "North America", value: 45, color: "bg-primary" },
		{ name: "Europe", value: 30, color: "bg-blue-500" },
		{ name: "Asia", value: 15, color: "bg-emerald-500" },
		{ name: "Others", value: 10, color: "bg-muted" },
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.15 },
		},
	};

	const itemVariants = {
		hidden: { x: -10, opacity: 0 },
		visible: { x: 0, opacity: 1 },
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="rounded-3xl border border-border/40 bg-card/30 p-6 backdrop-blur-xl h-full"
		>
			<h3 className="text-sm font-bold mb-6">Regional Distribution</h3>
			<div className="space-y-5">
				{regions.map((region) => (
					<motion.div
						key={region.name}
						variants={itemVariants}
						className="space-y-2"
					>
						<div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
							<span className="text-foreground/80">{region.name}</span>
							<span className="text-primary">{region.value}%</span>
						</div>

						<div className="h-2 w-full rounded-full bg-muted/20 overflow-hidden relative">
							{/* Animated Progress Fill */}
							<motion.div
								className={cn(
									"h-full rounded-full absolute left-0 top-0",
									region.color,
								)}
								initial={{ width: 0 }}
								animate={{ width: `${region.value}%` }}
								transition={{
									duration: 1.5,
									ease: [0.34, 1.56, 0.64, 1], // Custom elastic-style bezier
									delay: 0.2,
								}}
							/>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
