import { type MotionValue, motion } from "@/components/motion";

interface DiscoveryBackgroundProps {
	backgroundY: MotionValue<string>;
}

export function DiscoveryBackground({ backgroundY }: DiscoveryBackgroundProps) {
	return (
		<motion.div
			style={{ y: backgroundY }}
			className="fixed inset-0 pointer-events-none"
		>
			<div className="absolute inset-0 bg-linear-to-b from-purple-900/10 via-black to-black" />

			<motion.div
				animate={{
					opacity: [0.3, 0.5, 0.3],
					scale: [1, 1.2, 1],
				}}
				transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
			/>
			<motion.div
				animate={{
					opacity: [0.2, 0.4, 0.2],
					scale: [1.2, 1, 1.2],
				}}
				transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
			/>

			<div
				className="absolute inset-0 opacity-5"
				style={{
					backgroundImage:
						"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
				}}
			/>
		</motion.div>
	);
}
