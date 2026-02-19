import { motion } from "@/components/motion";

export function FeatureCard({
	icon,
	title,
	description,
	delay,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.5 }}
			whileHover={{ y: -8 }}
			className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group hover:border-purple-500/50 transition-all"
		>
			<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
				{icon}
			</div>
			<h3 className="text-xl font-bold mb-3">{title}</h3>
			<p className="text-gray-400 leading-relaxed">{description}</p>
		</motion.div>
	);
}
