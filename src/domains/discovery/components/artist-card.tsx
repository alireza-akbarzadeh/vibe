import { Check, Film, Music, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion } from "@/components/motion";
import type { ArtistType } from "../discovery.domain";

interface ArtistCardProps {
	artist: ArtistType;
	isSelected: boolean;
	onToggle: () => void;
	index: number;
}

export function ArtistCard({
	artist,
	isSelected,
	onToggle,
	index,
}: ArtistCardProps) {
	const [tilt, setTilt] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;

		setTilt({
			x: (y - 0.5) * 15,
			y: (x - 0.5) * -15,
		});
	};

	const handleMouseLeave = () => {
		setTilt({ x: 0, y: 0 });
	};

	// Size variants for bento-box layout
	const sizeClasses = {
		small: "md:col-span-1 md:row-span-1",
		medium: "md:col-span-1 md:row-span-2",
		large: "md:col-span-2 md:row-span-2",
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				delay: index * 0.05,
				type: "spring",
				stiffness: 260,
				damping: 20,
			}}
			className={`relative group cursor-pointer ${sizeClasses[artist.size] || "md:col-span-1 md:row-span-1"}`}
			onClick={onToggle}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{ transformStyle: "preserve-3d" }}
		>
			<motion.div
				animate={{
					rotateX: tilt.x,
					rotateY: tilt.y,
					scale: isSelected ? 0.95 : 1,
				}}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				className="relative w-full h-full rounded-3xl overflow-hidden"
				style={{ transformStyle: "preserve-3d" }}
			>
				{/* Background image */}
				<div className="absolute inset-0">
					<img
						src={artist.image}
						alt={artist.name}
						className="w-full h-full object-cover"
					/>

					{/* Gradient overlay */}
					<div
						className={`absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ${
							isSelected ? "opacity-40" : "opacity-80 group-hover:opacity-60"
						}`}
					/>

					{/* Selected overlay with glow */}
					{isSelected && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="absolute inset-0 bg-linear-to-br from-purple-600/40 via-pink-600/40 to-cyan-600/40 backdrop-blur-sm"
						/>
					)}

					{/* Animated border on hover */}
					<motion.div
						initial={{ opacity: 0 }}
						whileHover={{ opacity: 1 }}
						className="absolute inset-0 border-2 border-white/20 rounded-3xl"
					/>
				</div>

				{/* Content */}
				<div className="relative h-full flex flex-col justify-between p-4 md:p-6">
					{/* Top badges */}
					<div className="flex items-start justify-between gap-2">
						<div className="flex flex-wrap gap-2">
							{artist.trending && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
									className="px-2 py-1 rounded-full bg-linear-to-r from-orange-500/80 to-red-500/80 backdrop-blur-sm border border-white/20 flex items-center gap-1"
								>
									<TrendingUp className="w-3 h-3 text-white" />
									<span className="text-xs font-medium text-white">
										Trending
									</span>
								</motion.div>
							)}

							{artist.recommended && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: index * 0.05 + 0.3, type: "spring" }}
									className="px-2 py-1 rounded-full bg-linear-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm border border-white/20 flex items-center gap-1"
								>
									<Sparkles className="w-3 h-3 text-white" />
									<span className="text-xs font-medium text-white">
										For You
									</span>
								</motion.div>
							)}
						</div>

						{/* Type indicator */}
						<div className="p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
							{artist.type === "music" ? (
								<Music className="w-4 h-4 text-white" />
							) : (
								<Film className="w-4 h-4 text-white" />
							)}
						</div>
					</div>

					{/* Bottom info */}
					<div>
						{/* Selection indicator */}
						<motion.div
							initial={{ scale: 0, rotate: -180 }}
							animate={{
								scale: isSelected ? 1 : 0,
								rotate: isSelected ? 0 : -180,
							}}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50"
							style={{ transform: "translateZ(50px)" }}
						>
							<Check className="w-8 h-8 text-white" />
						</motion.div>

						{/* Artist name */}
						<motion.h3
							animate={{
								y: isSelected ? -10 : 0,
								opacity: isSelected ? 0.7 : 1,
							}}
							className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2"
						>
							{artist.name}
						</motion.h3>

						{/* Genres */}
						<div className="flex flex-wrap gap-1 mb-2">
							{artist.genres.slice(0, 2).map((genre) => (
								<span
									key={genre}
									className="px-2 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80"
								>
									{genre}
								</span>
							))}
						</div>

						{/* Followers */}
						<p className="text-sm text-white/60">
							{artist.followers} followers
						</p>
					</div>
				</div>

				{/* Magnetic hover effect - glowing ring */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileHover={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
					className="absolute inset-0 rounded-3xl"
					style={{
						boxShadow:
							"0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 40px rgba(139, 92, 246, 0.1)",
					}}
				/>

				{/* Selected state ring */}
				{isSelected && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="absolute inset-0 rounded-3xl border-4 border-purple-500 shadow-2xl shadow-purple-500/50"
					/>
				)}
			</motion.div>
		</motion.div>
	);
}
