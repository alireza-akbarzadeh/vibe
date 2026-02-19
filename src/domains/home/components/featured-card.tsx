import { Link } from "@tanstack/react-router";
import { Clock, Play, Star } from "lucide-react";
import { motion } from "@/components/motion";

interface FeaturedCardProps {
	movie: {
		id: string;
		title: string;
		year: number;
		rating: number;
		duration: string;
		image: string;
	};
	index: number;
}

export default function FeaturedCard(props: FeaturedCardProps) {
	const { movie, index } = props;

	return (
		<motion.div
			key={movie.title}
			initial={{ opacity: 0, x: 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			className="shrink-0 w-48 snap-start group cursor-pointer"
		>
			<Link
				to="/movies/$movieId"
				params={{ movieId: movie.id }}
				className="relative mb-4"
			>
				<div className="aspect-2/3 rounded-2xl overflow-hidden">
					<img
						src={movie.image}
						alt={movie.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
					<button
						type="button"
						className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all hover:scale-110"
					>
						<Play className="w-8 h-8 fill-current ml-0.5" />
					</button>
				</div>

				<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
					<Star className="w-3 h-3 text-yellow-400 fill-current" />
					<span className="text-white text-xs font-medium">{movie.rating}</span>
				</div>
			</Link>

			<h3 className="text-white font-semibold truncate mb-1">{movie.title}</h3>
			<div className="flex items-center gap-2 text-gray-500 text-sm">
				<span>{movie.year}</span>
				<span>•</span>
				<span className="flex items-center gap-1">
					<Clock className="w-3 h-3" />
					{movie.duration}
				</span>
			</div>
		</motion.div>
	);
}
