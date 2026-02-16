import { useNavigate } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, Star } from "lucide-react";
import { useRef, useState } from "react";
import { AddButton } from "@/components/buttons/add-button";
import { Button } from "@/components/ui/button";
import type { MediaList } from "@/orpc/models/media.schema";
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
	const containerRef = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	// 3D Parallax effect
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const mouseXSpring = useSpring(x);
	const mouseYSpring = useSpring(y);

	const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
	const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		const xPct = mouseX / width - 0.5;
		const yPct = mouseY / height - 0.5;
		x.set(xPct);
		y.set(yPct);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		x.set(0);
		y.set(0);
	};

	const sizeClasses = {
		large: "w-[400px] h-[225px]",
		featured: "w-[320px] h-[480px]",
		standard: "w-[280px] h-[420px]",
		personalized: "w-[300px] h-[450px]",
	};

	return (
		<motion.div
			ref={containerRef}
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{
				delay: index * 0.05,
				duration: 0.8,
				ease: [0.215, 0.61, 0.355, 1.0]
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={handleMouseLeave}
			className={`relative shrink-0 ${sizeClasses[variant]} group cursor-pointer`}
			style={{ perspective: 1000 }}
		>
			<motion.div
				style={{
					rotateX,
					rotateY,
					transformStyle: "preserve-3d",
				}}
				animate={{
					scale: isHovered ? 1.02 : 1,
				}}
				transition={{ type: "spring", stiffness: 400, damping: 30 }}
				className="relative w-full h-full rounded-2xl overflow-hidden bg-[#1a1a1a]"
			>
				{/* Background Image with Parallax Zoom */}
				<motion.img
					src={movie.thumbnail}
					alt={movie.title}
					animate={{
						scale: isHovered ? 1.1 : 1,
						filter: isHovered ? "brightness(0.7) blur(2px)" : "brightness(1) blur(0px)",
					}}
					transition={{ duration: 0.6 }}
					className="absolute inset-0 w-full h-full object-cover"
				/>

				{/* Intelligent Overlays */}
				<div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80" />

				{/* Play Icon Reveal */}
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{
						opacity: isHovered ? 1 : 0,
						scale: isHovered ? 1 : 0.5,
						y: isHovered ? 0 : 20
					}}
					className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
				>
					<div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
						<Play className="w-8 h-8 fill-white text-white ml-1" />
					</div>
				</motion.div>

				{/* Progress Bar */}
				{showProgress && "progress" in movie && typeof (movie as { progress?: number }).progress === "number" && (
					<div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-30">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${(movie as { progress: number }).progress}%` }}
							className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-red-500"
						/>
					</div>
				)}

				{/* Premium Rating Badge */}
				<motion.div
					style={{ transform: "translateZ(30px)" }}
					className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xl z-30"
				>
					<Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
					<span className="text-white text-xs font-black tracking-tighter">
						{movie.rating?.toFixed(1) ?? "0.0"}
					</span>
				</motion.div>

				{/* Content Container */}
				<div className="absolute inset-0 p-5 flex flex-col justify-end z-20">
					<motion.div
						style={{ transform: "translateZ(50px)" }}
						animate={{
							y: isHovered ? -10 : 0,
						}}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						{/* Title */}
						<h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-lg line-clamp-2">
							{movie.title}
						</h3>

						{/* Metadata Row */}
						<div className="flex items-center gap-3 mb-4">
							<span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
								{movie.releaseYear}
							</span>
							<div className="h-1 w-1 rounded-full bg-white/30" />
							<div className="flex gap-2">
								{movie.genres.slice(0, 1).map((g) => (
									<span
										key={g.genre.id}
										className="text-[10px] font-medium text-white/70 px-2 py-0.5 rounded-full border border-white/10"
									>
										{g.genre.name}
									</span>
								))}
							</div>
						</div>

						{/* Hover Actions */}
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{
								opacity: isHovered ? 1 : 0,
								height: isHovered ? "auto" : 0,
							}}
							className="overflow-hidden"
						>
							<p className="text-xs text-white/60 mb-4 line-clamp-2 leading-relaxed italic">
								{movie.description || "No description available."}
							</p>

							<div className="flex items-center gap-2">
								<Button
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										navigate({
											to: "/movies/$movieId",
											params: { movieId: movie.id },
										});
									}}
									className="flex-1 bg-white hover:bg-white/90 text-black border-none h-9 font-bold rounded-xl transition-all active:scale-95"
								>
									Watch Now
								</Button>
								<div className="flex gap-1.5">
									<AddButton />
									<MovieInfoDialog mediaId={movie.id} />
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Interaction Glow */}
				<motion.div
					animate={{
						opacity: isHovered ? 0.4 : 0,
						scale: isHovered ? 1.2 : 1
					}}
					className="absolute -inset-20 bg-linear-to-tr from-purple-500/20 via-pink-500/20 to-transparent pointer-events-none blur-3xl z-10"
				/>
			</motion.div>
		</motion.div>
	);
}
