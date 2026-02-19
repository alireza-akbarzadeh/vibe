import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "@/components/motion";
import { Button } from "@/components/ui/button";

interface LightBoxProps {
	setLightboxOpen: (open: boolean) => void;
	navigate: (direction: "next" | "prev") => void;
	lightboxOpen: boolean;
	currentImage: number;
	imageLength: number;
	src: string;
}

export function LightBox(props: LightBoxProps) {
	const {
		src,
		imageLength,
		currentImage,
		navigate,
		setLightboxOpen,
		lightboxOpen,
	} = props;
	return (
		<AnimatePresence>
			{lightboxOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
					onClick={() => setLightboxOpen(false)}
				>
					{/* Close button */}
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
						onClick={() => setLightboxOpen(false)}
					>
						<X className="w-6 h-6" />
					</Button>

					{/* Navigation */}
					<Button
						variant="ghost"
						size="icon"
						className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
							navigate("prev");
						}}
					>
						<ChevronLeft className="w-6 h-6" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
							navigate("next");
						}}
					>
						<ChevronRight className="w-6 h-6" />
					</Button>

					{/* Image */}
					<motion.img
						key={currentImage}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						src={src}
						alt="Full size"
						className="max-w-[90vw] max-h-[90vh] object-contain"
						onClick={(e) => e.stopPropagation()}
					/>

					{/* Counter */}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
						{currentImage + 1} / {imageLength}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
