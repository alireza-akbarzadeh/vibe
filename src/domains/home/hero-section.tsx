import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

export default function HeroSection() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {

		const handleMouseMove = (e: MouseEvent): void => {
			setMousePosition({
				x: (e.clientX / window.innerWidth - 0.5) * 20,
				y: (e.clientY / window.innerHeight - 0.5) * 20,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<section className="relative h-screen w-full overflow-hidden bg-black">
			{/* Animated gradient background */}
			<div className="absolute inset-0">
				<div
					className="absolute inset-0 bg-linear-to-br from-purple-900/40 via-black to-cyan-900/30"
					style={{
						transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
						transition: "transform 0.3s ease-out",
					}}
				/>

				{/* Floating orbs */}
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.3, 0.2],
					}}
					transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
				/>
			</div>

			{/* Grid overlay */}
			<div
				className="absolute inset-0 opacity-10"
				style={{
					backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 h-full flex flex-col justify-center items-center px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, ease: "easeOut" }}
					className="text-center max-w-5xl"
				>
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8"
					>
						<span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
						<span className="text-sm text-gray-300 font-medium">
							Now streaming worldwide
						</span>
					</motion.div>

					{/* Main headline */}
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
						<span className="block text-white">Feel Every</span>
						<span className="block bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
							Beat & Scene
						</span>
					</h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.8 }}
						className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
					>
						Immerse yourself in millions of songs and blockbuster movies. One
						platform. Infinite emotions. Zero limits.
					</motion.p>

					{/* CTAs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9, duration: 0.6 }}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
					>
						<Link
							to="/movies"
							className={buttonVariants({ className: "group relative px-8 py-6 text-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0 rounded-full! overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30", size: "lg" })}
						>
							<span className="relative z-10 flex items-center gap-2">
								<Play className="w-5 h-5 fill-current" />
								Start Streaming Free
							</span>
							<div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</Link>

						<Link
							to="/library"
							className={buttonVariants({ className: "px-8 rounded-full!  py-6 text-lg font-semibold text-white/80 hover:text-white hover:bg-white/10  border border-white/20 backdrop-blur-sm transition-all duration-300", size: "lg" })}
						>
							Explore Library
						</Link>
					</motion.div>
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5, duration: 0.8 }}
					className="absolute bottom-10 left-1/2 -translate-x-1/2"
				>
					<motion.div
						animate={{ y: [0, 8, 0] }}
						transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
					>
						<motion.div
							animate={{ opacity: [1, 0.3, 1] }}
							transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
							className="w-1.5 h-2.5 bg-white/50 rounded-full"
						/>
					</motion.div>
				</motion.div>
			</div>

			{/* Bottom gradient fade */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0a0a0a] to-transparent" />
		</section>
	);
}
