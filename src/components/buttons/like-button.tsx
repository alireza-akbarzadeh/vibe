import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

// Assuming Size is exported from your add-button file
type Size = "x-small" | "small" | "medium" | "large" | "extra-large";

interface LikeButtonProps extends ComponentProps<"button"> {
	isLiked?: boolean;
	iconSize?: Size;
}

export function LikeButton({
	isLiked,
	iconSize = "small",
	className,
	onClick,
	...props
}: LikeButtonProps) {

	const mapSized: Record<Size, string> = {
		"x-small": "size-4",
		small: "size-5",
		medium: "size-6",
		large: "size-8",
		"extra-large": "size-10",
	};

	return (
		<Button
			variant="ghost"
			onClick={onClick}
			className={cn(
				"rounded-full transition-all duration-300",
				isLiked ? "text-pink-500 hover:text-pink-600 bg-pink-500/10" : "text-[#b3b3b3] hover:text-white bg-white/5",
				className
			)}
			{...props}
		>
			<motion.div
				key={isLiked ? "liked" : "unliked"}
				initial={{ scale: 1 }}
				animate={{ scale: isLiked ? [1, 1.4, 1] : 1 }}
				transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
			>
				<Heart
					className={cn(
						mapSized[iconSize],
						isLiked && "fill-current"
					)}
				/>
			</motion.div>
		</Button>
	);
}