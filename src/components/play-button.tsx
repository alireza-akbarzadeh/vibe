import { Pause, Play } from "lucide-react";
import { motion } from "@/components/motion";

interface PlayButtonProps {
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	value: boolean;
}

export function PlayButton({ onOpenChange, value }: PlayButtonProps) {
	return (
		<button
			type="button"
			onClick={(event) => {
				event.stopPropagation();
				onOpenChange((prev) => !prev);
			}}
			className="absolute z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
		>
			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				className="rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center
                   w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                   shadow-2xl shadow-purple-500/50 transition-shadow"
			>
				{value ? (
					<Pause className="text-white w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
				) : (
					<Play className="text-white w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
				)}
			</motion.div>
		</button>
	);
}
