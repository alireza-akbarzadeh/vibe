import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import type { MovieImage } from "@/domains/movies/movie-types.ts";

interface MovieImageProps {
	images: MovieImage[];
	openLightbox: (index: number) => void;
}

export function MovieImages(props: MovieImageProps) {
	const { images, openLightbox } = props;
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{images.map((image, index) => (
				<motion.div
					key={image.url}
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ delay: index * 0.1, duration: 0.5 }}
					className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
					onClick={() => openLightbox(index)}
				>
					<img
						src={image.url}
						alt={`Scene from the movie: ${image.url || `slide ${index + 1}`}`}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
					/>

					{/* Overlay */}
					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
						<ZoomIn className="w-8 h-8 text-white" />
					</div>

					{/* Border glow */}
					<div className="absolute inset-0 rounded-xl border-2 border-purple-500/0 group-hover:border-purple-500/50 transition-colors" />
				</motion.div>
			))}
		</div>
	);
}
