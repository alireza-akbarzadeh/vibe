import { motion } from "@/components/motion";

import { Card } from "@/components/ui/card.tsx";
import type { Stats } from "@/domains/movies/containers/stats-bar.tsx";

interface StatusCardProps {
	index: number;
	stat: Stats;
}

export function StatsCard(props: StatusCardProps) {
	const { stat, index } = props;
	return (
		<motion.div
			key={stat.label}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			whileHover={{ scale: 1.05, y: -4 }}
		>
			<Card className="relative overflow-hidden bg-white/3 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/5 hover:border-white/20 transition-all duration-300 group">
				<div
					className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity`}
				/>

				<div
					className={`absolute inset-0 rounded-lg bg-linear-to-r ${stat.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity`}
				/>

				<div className="relative space-y-3">
					<div
						className={`inline-flex p-3 rounded-xl bg-linear-to-br ${stat.bgGradient}`}
					>
						<stat.icon
							className={`w-6 h-6 bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}
							style={{ WebkitTextFillColor: "transparent" }}
						/>
					</div>
					<p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
						{stat.label}
					</p>
					<p className="text-3xl font-bold text-white">{stat.value}</p>
					<p className="text-sm text-gray-500">{stat.subtext}</p>
				</div>
			</Card>
		</motion.div>
	);
}
