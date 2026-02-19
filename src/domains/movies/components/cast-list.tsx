import { motion } from "@/components/motion";
import type { CastType } from "@/domains/movies/containers/cast-carousel.tsx";

interface CastListProps {
	actor: CastType;
	index: number;
}
export function CastList(props: CastListProps) {
	const { actor, index } = props;
	return (
		<motion.div
			key={actor.name}
			initial={{ opacity: 0, x: 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			className="shrink-0 w-40 snap-start group cursor-pointer"
		>
			<div className="relative">
				{/* Avatar */}
				<div className="relative mb-4 overflow-hidden rounded-full">
					<div className="aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-purple-500 transition-all duration-300">
						<img
							src={actor.image}
							alt={actor.name}
							className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
						/>
					</div>

					{/* Gradient border effect */}
					<div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300" />
				</div>

				{/* Info */}
				<div className="text-center space-y-1">
					<p className="text-white font-medium group-hover:text-purple-400 transition-colors">
						{actor.name}
					</p>
					<p className="text-sm text-gray-400">{actor.character}</p>
				</div>
			</div>
		</motion.div>
	);
}
