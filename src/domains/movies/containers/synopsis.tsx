import {
	Briefcase,
	Building,
	Calendar,
	ChevronDown,
	Clock,
	User,
	Users,
} from "lucide-react";
import { useState } from "react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button.tsx";
import type { MovieTypes } from "@/types/app.ts";

interface SynopsisProps {
	movie: MovieTypes;
}

export function Synopsis({ movie }: SynopsisProps) {
	const [expanded, setExpanded] = useState(false);

	const details = [
		{ icon: User, label: "Director", value: movie.director },
		{ icon: Briefcase, label: "Writers", value: movie.writers.join(", ") },
		{ icon: Users, label: "Stars", value: movie.stars.join(", ") },
		{ icon: Building, label: "Production", value: movie.productionCo },
		{ icon: Calendar, label: "Release", value: movie.releaseDate },
		{ icon: Clock, label: "Runtime", value: movie.duration },
	];

	return (
		<section className="relative py-20 bg-[#0a0a0a]">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="space-y-12"
				>
					{/* Overview */}
					<div className="space-y-6">
						<h2 className="text-3xl md:text-4xl font-bold text-white">
							Overview
						</h2>

						<div className="relative">
							<p
								className={`text-gray-300 text-lg leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}
							>
								{movie.synopsis}
							</p>

							{!expanded && (
								<div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#0a0a0a] to-transparent" />
							)}
						</div>

						<Button
							variant="ghost"
							onClick={() => setExpanded(!expanded)}
							className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
						>
							{expanded ? "Show Less" : "Read More"}
							<ChevronDown
								className={`w-4 h-4 ml-2 transition-transform ${expanded ? "rotate-180" : ""}`}
							/>
						</Button>
					</div>

					{/* Technical Details */}
					<div className="space-y-6">
						<h3 className="text-2xl font-bold text-white">Details</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{details.map((detail, index) => (
								<motion.div
									key={detail.label}
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1, duration: 0.5 }}
									className="group"
								>
									<div className="flex items-start gap-3">
										<div className="p-2 rounded-lg bg-white/3 group-hover:bg-purple-500/10 transition-colors">
											<detail.icon className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
												{detail.label}
											</p>
											<p className="text-white font-medium hover:text-purple-400 transition-colors cursor-pointer">
												{detail.value}
											</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
