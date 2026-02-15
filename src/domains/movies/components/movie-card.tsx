import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { useState } from "react";
import { AddButton } from "@/components/buttons/add-button";
import { Button } from "@/components/ui/button";
import type { MediaList } from "@/orpc/models/media.schema";
import { generateSlug } from "@/lib/utils";
import type { MovieVariantCard } from "./movie-carousel";
import { MovieInfoDialog } from "./movie-info-dialog";

interface MovieCardProps {
	movie: MediaList;
	index: number;
	showProgress: boolean;
	variant: MovieVariantCard;
}

export function MovieCard({
	movie,
	index,
	showProgress,
	variant = "standard",
}: MovieCardProps) {
	const navigate = useNavigate();

	const [isHovered, setIsHovered] = useState(false);

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	// Size based on variant
	const sizeClasses = {
		large: "w-[400px] h-[225px]",
		featured: "w-[320px] h-[480px]",
		standard: "w-[280px] h-[420px]",
		personalized: "w-[300px] h-[450px]",
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: index * 0.05, duration: 0.5 }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={handleMouseLeave}
			className={`relative shrink-0 ${sizeClasses[variant]} group cursor-pointer`}
			style={{ perspective: 1000 }}
		>
			<motion.div
				animate={{
					scale: isHovered ? 1.05 : 1,
					z: isHovered ? 50 : 0,
				}}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="relative w-full h-full rounded-2xl overflow-hidden"
			>
				{/* Movie poster */}
				<img
					src={movie.thumbnail}
					alt={movie.title}
					className="w-full h-full object-cover"
				/>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

				{/* Continue watching progress (optional; not on MediaList schema) */}
				{showProgress && "progress" in movie && typeof (movie as { progress?: number }).progress === "number" && (
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${(movie as { progress: number }).progress}%` }}
							transition={{ duration: 1, delay: 0.3 }}
							className="h-full bg-linear-to-r from-purple-600 to-pink-600"
						/>
					</div>
				)}

				{/* Rating badge */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: index * 0.05 + 0.2 }}
					className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20"
				>
					<Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
					<span className="text-white text-sm font-bold">{movie.rating?.toFixed(1) ?? 0}</span>
				</motion.div>

				{/* Content */}
				<div className="absolute inset-0 p-6 flex flex-col justify-end">
					{/* Title */}
					<motion.h3
						animate={{
							y: isHovered ? -20 : 0,
						}}
						transition={{ duration: 0.3 }}
						className="text-xl font-bold text-white mb-2 line-clamp-2"
					>
						{movie.title}
					</motion.h3>

					{/* Metadata */}
					<div className="flex items-center gap-2 mb-3">
						<span className="text-sm text-gray-300">{movie.releaseYear}</span>
						<span className="text-gray-500">•</span>
						<div className="flex gap-1">
							{movie.genres.slice(0, 2).map((g) => (
								<span key={g.genre.id} className="text-xs text-gray-400">
									{g.genre.name}
								</span>
							))}
						</div>
					</div>

					{/* Hover content */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{
							opacity: isHovered ? 1 : 0,
							y: isHovered ? 0 : 20,
						}}
						transition={{ duration: 0.3 }}
						className="space-y-3"
					>
						{/* Description */}
						{movie.description ? (
							<p className="text-sm text-gray-300 line-clamp-3">
								{movie.description}
							</p>
						) : null}

						{/* Action buttons */}
						<div className="flex gap-2">
							<Button
								onClick={() => {
									navigate({
										to: "/movies/$movieId",
										params: { movieId: generateSlug(movie.title) },
									});
								}}
								size="sm"
								className="flex-1 bg-white h-10 text-black hover:bg-gray-200 rounded-lg font-semibold group"
							>
								<Play className="w-4 h-4 mr-1 fill-black group-hover:scale-110 transition-transform" />
								Play
							</Button>
							<AddButton />
							<MovieInfoDialog />
						</div>
					</motion.div>
				</div>

				{/* Glow effect on hover */}
				{/* <motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: isHovered ? 1 : 0 }}
					className="absolute inset-0 rounded-2xl"
					style={{
						boxShadow:
							"0 0 60px rgba(139, 92, 246, 0.6), inset 0 0 60px rgba(139, 92, 246, 0.1)",
					}}
				/> */}

				{/* 3D lighting effect */}
				<motion.div
					animate={{ opacity: isHovered ? 0.3 : 0 }}
					className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-transparent pointer-events-none"
				/>
			</motion.div>
		</motion.div>
	);
}
