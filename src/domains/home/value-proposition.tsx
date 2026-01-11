import { motion } from "framer-motion";
import { Headphones, Sparkles, Tv, Zap } from "lucide-react";
import { Typography } from "@/components/ui/typography";

const features = [
	{
		icon: Headphones,
		title: "100M+ Songs",
		description: "From underground artists to global superstars",
		gradient: "from-purple-500 to-pink-500",
	},
	{
		icon: Tv,
		title: "50K+ Movies",
		description: "Blockbusters, classics, and hidden gems",
		gradient: "from-cyan-500 to-blue-500",
	},
	{
		icon: Sparkles,
		title: "AI-Curated",
		description: "Personalized to your unique taste",
		gradient: "from-pink-500 to-orange-500",
	},
	{
		icon: Zap,
		title: "Zero Ads",
		description: "Pure, uninterrupted entertainment",
		gradient: "from-yellow-500 to-amber-500",
	},
];

export default function ValueProposition() {
	return (
		<section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
			<div className="absolute inset-0">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-20"
				>
					<Typography.H2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						Listen & Watch{" "}
						<span className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
							Instantly
						</span>
					</Typography.H2>
					<Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto">
						Everything you love, unified in one seamless experience
					</Typography.P>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.15, duration: 0.6 }}
						>
							<div className="group relative h-full">
								{/* Glassmorphism card */}
								<div className="relative h-full p-8 rounded-3xl bg-white/3 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/6 hover:border-white/20 hover:scale-[1.02] hover:-translate-y-1">
									{/* Hover glow effect */}
									<div
										className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
									/>

									{/* Icon */}
									<div
										className={`inline-flex p-4 rounded-2xl bg-linear-to-br ${feature.gradient} mb-6`}
									>
										<feature.icon className="w-7 h-7 text-white" />
									</div>

									<Typography.H3 className="text-xl font-bold text-white mb-3">
										{feature.title}
									</Typography.H3>
									<Typography.P className="text-gray-400 leading-relaxed m-0!">
										{feature.description}
									</Typography.P>

									{/* Corner accent */}
									<div
										className={`absolute -bottom-10 -right-10 w-32 h-32 bg-linear-to-br ${feature.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`}
									/>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
