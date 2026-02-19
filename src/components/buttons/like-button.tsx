/** biome-ignore-all lint/suspicious/noArrayIndexKey: The index is used as a key for a list of characters, which is stable. */

import { Heart } from "lucide-react";
import type { ComponentProps } from "react";
import { AnimatePresence, motion } from "@/components/motion";
import { useFavorites } from "@/domains/movies/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

// Assuming Size is exported from your add-button file
type Size = "x-small" | "small" | "medium" | "large" | "extra-large";

interface LikeButtonProps extends ComponentProps<"button"> {
	mediaId: string;
	iconSize?: Size;
	className?: string;
}

export function LikeButton({
	mediaId,
	iconSize = "small",
	className,
	...props
}: LikeButtonProps) {
	const { useIsFavorite, useToggleFavorite } = useFavorites();
	const { data: isFavorite = false, isLoading } = useIsFavorite(mediaId);
	const toggleFavorite = useToggleFavorite();

	const mapSized: Record<Size, string> = {
		"x-small": "size-4",
		small: "size-5",
		medium: "size-6",
		large: "size-7",
		"extra-large": "size-10",
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();

		toggleFavorite.mutate({
			mediaId,
			isFavorite,
		});
	};

	return (
		<Button
			variant="ghost"
			onClick={handleClick}
			disabled={isLoading || toggleFavorite.isPending}
			className={cn(
				"rounded-2xl w-14 h-14 transition-all duration-500 relative overflow-hidden group border border-transparent",
				isFavorite
					? "text-pink-500 bg-pink-500/10 border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
					: "text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border-white/5",
				(isLoading || toggleFavorite.isPending) &&
					"opacity-50 cursor-not-allowed",
				className,
			)}
			{...props}
		>
			{/* Dynamic Glow Background */}
			<AnimatePresence>
				{isFavorite && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-radial-gradient from-pink-500/20 via-transparent to-transparent"
					/>
				)}
			</AnimatePresence>

			{/* Ripple effect on like */}
			<AnimatePresence>
				{isFavorite && (
					<motion.div
						key="ripple"
						initial={{ scale: 0, opacity: 0.8 }}
						animate={{ scale: 2.5, opacity: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						className="absolute inset-0 rounded-full bg-pink-500/30"
					/>
				)}
			</AnimatePresence>

			<motion.div
				key={isFavorite ? "liked" : "unliked"}
				animate={{
					scale: isFavorite ? [1, 1.4, 0.9, 1.1, 1] : 1,
					rotate: isFavorite ? [0, -20, 20, -10, 0] : 0,
				}}
				transition={{
					duration: 0.7,
					type: "spring",
					stiffness: 300,
					damping: 12,
				}}
				className="relative z-10"
			>
				<Heart
					className={cn(
						mapSized[iconSize],
						isFavorite &&
							"fill-current drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]",
						"transition-all duration-300",
					)}
				/>
			</motion.div>

			{/* Multi-layered Particles */}
			<AnimatePresence>
				{isFavorite && (
					<div className="absolute inset-0 pointer-events-none">
						{[...Array(8)].map((_, i) => (
							<motion.div
								key={`particle-${mediaId}-${i}`}
								initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
								animate={{
									scale: [0, 1.2, 0],
									x: Math.cos((i * Math.PI) / 4) * (30 + Math.random() * 10),
									y: Math.sin((i * Math.PI) / 4) * (30 + Math.random() * 10),
									opacity: [1, 0.8, 0],
								}}
								transition={{
									duration: 0.8,
									ease: "easeOut",
									delay: Math.random() * 0.1,
								}}
								className={cn(
									"absolute w-1 h-1 rounded-full left-1/2 top-1/2",
									i % 2 === 0 ? "bg-pink-400" : "bg-white",
								)}
							/>
						))}
					</div>
				)}
			</AnimatePresence>
		</Button>
	);
}
