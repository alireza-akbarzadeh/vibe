import { motion } from "@/components/motion";

export function SmallCard({
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
			transition={{ delay }}
			whileHover={{ y: -4 }}
			className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 group hover:border-purple-500/50 transition-all"
		>
			<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-4 text-purple-400">
				{icon}
			</div>
			<h3 className="text-lg font-semibold mb-2">{title}</h3>
			<p className="text-sm text-gray-400">{description}</p>
		</motion.div>
	);
}
