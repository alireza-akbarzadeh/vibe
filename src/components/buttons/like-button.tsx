import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { ComponentProps } from "react";
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
				"rounded-full w-12 h-12 transition-all duration-300 relative overflow-hidden",
				isFavorite
					? "text-pink-500 hover:text-pink-600 bg-pink-500/10"
					: "text-[#b3b3b3] hover:text-white bg-white/5",
				(isLoading || toggleFavorite.isPending) && "opacity-50 cursor-not-allowed",
				className,
			)}
			{...props}
		>
			{/* Ripple effect on like */}
			{isFavorite && (
				<motion.div
					key="ripple"
					initial={{ scale: 0, opacity: 0.5 }}
					animate={{ scale: 2, opacity: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="absolute inset-0 rounded-full bg-pink-500"
				/>
			)}

			<motion.div
				key={isFavorite ? "liked" : "unliked"}
				initial={{ scale: 1 }}
				animate={{
					scale: isFavorite ? [1, 1.5, 1.2, 1] : 1,
					rotate: isFavorite ? [0, -15, 15, -10, 0] : 0,
					y: isFavorite ? [0, -3, 0] : 0,
				}}
				transition={{
					duration: 0.5,
					type: "spring",
					stiffness: 400,
					damping: 15,
				}}
			>
				<Heart
					className={cn(
						mapSized[iconSize],
						isFavorite && "fill-current drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]",
						"transition-all duration-300",
					)}
				/>
			</motion.div>

			{/* Particles effect when liked */}
			{isFavorite &&
				[...Array(6)].map((_, i) => (
					<motion.div
						key={`particle-${i}`}
						initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
						animate={{
							scale: [0, 1, 0],
							x: Math.cos((i * Math.PI) / 3) * 20,
							y: Math.sin((i * Math.PI) / 3) * 20,
							opacity: [1, 0.8, 0],
						}}
						transition={{
							duration: 0.6,
							ease: "easeOut",
							delay: 0.1,
						}}
						className="absolute w-1 h-1 bg-pink-400 rounded-full"
						style={{
							left: "50%",
							top: "50%",
						}}
					/>
				))}
		</Button>
	);
}