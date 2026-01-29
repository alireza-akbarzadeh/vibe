import type { MovieTypes } from "@/types/app";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import MovieInfo from "./movie-info";

interface MovieHeroProps {
	movie: MovieTypes;
	onClick?: (type: "movie" | "trailer") => void;
}

export function MovieHero({ movie, onClick }: MovieHeroProps) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: (e.clientX / window.innerWidth - 0.5) * 20,
				y: (e.clientY / window.innerHeight - 0.5) * 20,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<section className="relative min-h-screen flex items-center overflow-hidden">
			{/* Background with parallax */}
			<div className="absolute inset-0">
				<motion.div
					style={{
						transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
					}}
					transition={{ type: "spring", stiffness: 50 }}
					className="absolute inset-0 scale-110"
				>
					<img
						src={movie.backdrop}
						alt={movie.title}
						className="w-full h-full object-cover blur-3xl"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/60" />
					<div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
				</motion.div>

				{/* Floating orbs */}
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.15, 0.25, 0.15],
					}}
					transition={{ duration: 8, repeat: Infinity }}
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.1, 0.2, 0.1],
					}}
					transition={{ duration: 10, repeat: Infinity }}
					className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
				/>

				{/* Grid overlay */}
				<div
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
				<div className="grid md:grid-cols-[400px_1fr] gap-12 items-center">
					{/* Poster */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="relative group"
					>
						<motion.div
							whileHover={{ scale: 1.05, rotate: -2 }}
							transition={{ duration: 0.3 }}
							className="relative"
						>
							<img
								src={movie.poster}
								alt={movie.title}
								className="w-full rounded-2xl shadow-2xl shadow-purple-500/20"
							/>
							<div className="absolute inset-0 rounded-2xl bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</motion.div>
					</motion.div>
					<MovieInfo movie={movie} onClick={onClick} />
				</div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
			>
				<span className="text-sm">Scroll for more</span>
				<ChevronDown className="w-6 h-6" />
			</motion.div>
		</section>
	);
}
