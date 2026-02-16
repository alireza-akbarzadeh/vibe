
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import {
	Clapperboard,
	Film,
	Globe,
	Headphones,
	Music,
	Play,
	PlaySquare,
	Tv,
	Volume2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Floating media card component
function FloatingMediaCard({
	className,
	delay = 0,
	duration = 20,
	image,
	title,
	type,
}: {
	className?: string;
	delay?: number;
	duration?: number;
	image: string;
	title: string;
	type: "movie" | "music" | "series";
}) {
	const typeIcons = {
		movie: Film,
		music: Music,
		series: Tv,
	};
	const Icon = typeIcons[type];

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{
				opacity: [0, 1, 1, 0],
				scale: [0.8, 1, 1, 0.8],
				y: [0, -20, -40, -60],
				rotate: [0, 2, -2, 0],
			}}
			transition={{
				duration,
				delay,
				repeat: Infinity,
				ease: "easeInOut",
			}}
			className={cn(
				"absolute w-32 h-44 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 backdrop-blur-sm",
				className,
			)}
		>
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${image})` }}
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
			<div className="absolute bottom-2 left-2 right-2">
				<div className="flex items-center gap-1 mb-1">
					<Icon className="w-3 h-3 text-cyan-400" />
					<span className="text-[10px] text-cyan-400 uppercase tracking-wider">
						{type}
					</span>
				</div>
				<p className="text-xs font-semibold text-white truncate">{title}</p>
			</div>
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
				animate={{ x: ["-100%", "200%"] }}
				transition={{
					duration: 2,
					delay: delay + 1,
					repeat: Infinity,
					repeatDelay: 4,
				}}
			/>
		</motion.div>
	);
}

// Audio visualizer bars
function AudioVisualizer({ className }: { className?: string }) {
	return (
		<div className={cn("flex items-end gap-1 h-8", className)}>
			{[...Array(5)].map((_, i) => (
				<motion.div
					key={i}
					className="w-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full"
					animate={{
						height: ["40%", "100%", "60%", "80%", "40%"],
					}}
					transition={{
						duration: 0.8,
						delay: i * 0.1,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
}

// Glowing orb particle
function GlowingOrb({
	className,
	color,
	size = 200,
	delay = 0,
}: {
	className?: string;
	color: string;
	size?: number;
	delay?: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{
				opacity: [0.3, 0.6, 0.3],
				scale: [1, 1.2, 1],
				x: [0, 30, -20, 0],
				y: [0, -20, 30, 0],
			}}
			transition={{
				duration: 8,
				delay,
				repeat: Infinity,
				ease: "easeInOut",
			}}
			className={cn(
				"absolute rounded-full blur-[80px] pointer-events-none",
				className,
			)}
			style={{
				width: size,
				height: size,
				background: color,
			}}
		/>
	);
}

// Pulsing ring motion
function PulsingRings() {
	return (
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
			{[...Array(3)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/20"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{
						opacity: [0, 0.5, 0],
						scale: [0.8, 1.5, 2],
					}}
					transition={{
						duration: 4,
						delay: i * 1.3,
						repeat: Infinity,
						ease: "easeOut",
					}}
				/>
			))}
		</div>
	);
}

// Stats counter with motion
function AnimatedCounter({ value, label }: { value: string; label: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 1.2 }}
			className="text-center"
		>
			<motion.div
				className="text-2xl md:text-3xl font-bold text-white"
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", stiffness: 200, delay: 1.4 }}
			>
				{value}
			</motion.div>
			<div className="text-xs text-gray-500 uppercase tracking-wider">
				{label}
			</div>
		</motion.div>
	);
}

export default function HeroSection() {
	const [currentWord, setCurrentWord] = useState(0);
	const words = ["MUSIC", "MOVIES", "SHOWS", "LIVE"];

	// Rotate featured words
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentWord((prev) => (prev + 1) % words.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	// Physics-based mouse tracking
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const springConfig = { damping: 25, stiffness: 150 };
	const dx = useSpring(mouseX, springConfig);
	const dy = useSpring(mouseY, springConfig);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			const xPct = (e.clientX / window.innerWidth - 0.5) * 100;
			const yPct = (e.clientY / window.innerHeight - 0.5) * 100;
			mouseX.set(xPct);
			mouseY.set(yPct);
		},
		[mouseX, mouseY],
	);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [handleMouseMove]);

	// 3D tilt transforms
	const rotateX = useTransform(dy, [-50, 50], [3, -3]);
	const rotateY = useTransform(dx, [-50, 50], [-3, 3]);

	const floatingCards = [
		{
			image:
				"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=400&fit=crop",
			title: "Inception",
			type: "movie" as const,
			className: "top-[15%] left-[5%] md:left-[10%]",
			delay: 0,
		},
		{
			image:
				"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=400&fit=crop",
			title: "Chill Beats",
			type: "music" as const,
			className: "top-[25%] right-[5%] md:right-[12%]",
			delay: 2,
		},
		{
			image:
				"https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop",
			title: "Breaking Bad",
			type: "series" as const,
			className: "bottom-[25%] left-[8%] md:left-[15%]",
			delay: 4,
		},
		{
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=400&fit=crop",
			title: "Electronic",
			type: "music" as const,
			className: "bottom-[30%] right-[8%] md:right-[10%]",
			delay: 6,
		},
	];

	const categories = [
		{
			icon: Music,
			label: "Music",
			color: "from-blue-500 to-cyan-500",
			glow: "group-hover:shadow-blue-500/30",
		},
		{
			icon: Clapperboard,
			label: "Cinema",
			color: "from-purple-500 to-pink-500",
			glow: "group-hover:shadow-purple-500/30",
		},
		{
			icon: Headphones,
			label: "Spatial",
			color: "from-emerald-500 to-teal-500",
			glow: "group-hover:shadow-emerald-500/30",
		},
		{
			icon: PlaySquare,
			label: "Shorts",
			color: "from-pink-500 to-rose-500",
			glow: "group-hover:shadow-pink-500/30",
		},
		{
			icon: Globe,
			label: "Global",
			color: "from-orange-500 to-amber-500",
			glow: "group-hover:shadow-orange-500/30",
		},
	];

	return (
		<section className="relative min-h-screen w-full overflow-hidden bg-[#030303] selection:bg-cyan-500/30">
			{/* Dynamic Background */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(0,0,0,0))]" />

				{/* Animated Orbs */}
				<GlowingOrb
					color="rgba(6, 182, 212, 0.4)"
					size={400}
					className="top-[10%] left-[20%]"
					delay={0}
				/>
				<GlowingOrb
					color="rgba(139, 92, 246, 0.3)"
					size={300}
					className="top-[40%] right-[15%]"
					delay={2}
				/>
				<GlowingOrb
					color="rgba(236, 72, 153, 0.2)"
					size={250}
					className="bottom-[20%] left-[30%]"
					delay={4}
				/>

				{/* Mouse-following spotlight */}
				<motion.div
					style={{ x: dx, y: dy, translateX: "-50%", translateY: "-50%" }}
					className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px]"
				/>
			</div>

			{/* Grid Pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

			{/* Pulsing Rings */}
			<PulsingRings />

			{/* Floating Media Cards */}
			<div className="hidden md:block">
				{floatingCards.map((card, i) => (
					<FloatingMediaCard key={i} {...card} />
				))}
			</div>

			{/* Main Content */}
			<motion.div
				style={{ rotateX, rotateY, perspective: 1200 }}
				className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-20"
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className="text-center max-w-5xl"
				>
					{/* Premium Badge with Audio Visualizer */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 mb-10 shadow-2xl shadow-cyan-500/5"
					>
						<AudioVisualizer />
						<span className="text-xs tracking-[0.2em] uppercase text-gray-300 font-semibold">
							Now Streaming
						</span>
						<motion.div
							className="w-2 h-2 rounded-full bg-cyan-500"
							animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
							transition={{ duration: 2, repeat: Infinity }}
						/>
					</motion.div>

					{/* Main Headline */}
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.95]">
						<motion.span
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="text-white block"
						>
							STREAM YOUR
						</motion.span>

						{/* Animated Word Carousel */}
						<span className="relative h-[1.2em] flex items-center justify-center overflow-hidden">
							<AnimatePresence mode="wait">
								<motion.span
									key={currentWord}
									initial={{ y: 80, opacity: 0, rotateX: -40 }}
									animate={{ y: 0, opacity: 1, rotateX: 0 }}
									exit={{ y: -80, opacity: 0, rotateX: 40 }}
									transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
									className="absolute bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
								>
									{words[currentWord]}
								</motion.span>
							</AnimatePresence>
						</span>
					</h1>
					{/* Animated Underline */}
					<motion.div
						initial={{ width: 0, opacity: 0 }}
						animate={{ width: "200px", opacity: 1 }}
						transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
						className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full mx-auto mb-8"
					/>

					{/* Subtitle */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.8 }}
						className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
					>
						Experience the next generation of entertainment with{" "}
						<span className="text-cyan-400 font-medium">spatial audio</span>,{" "}
						<span className="text-blue-400 font-medium">8K visuals</span>, and{" "}
						<span className="text-purple-400 font-medium">zero latency</span>.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
					>
						<Button
							size="lg"
							className="h-14 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg font-bold group relative overflow-hidden shadow-lg shadow-cyan-500/25 border-0"
						>
							<motion.div
								className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
								animate={{ x: ["-100%", "200%"] }}
								transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
							/>
							<span className="relative z-10 flex items-center gap-2">
								<motion.div
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 1, repeat: Infinity }}
								>
									<Play className="w-5 h-5 fill-current" />
								</motion.div>
								Start Free Trial
							</span>
						</Button>

						<Button
							variant="ghost"
							size="lg"
							className="h-14 px-8 text-white/70 hover:text-white hover:bg-white/5 text-lg font-semibold group"
						>
							<Volume2 className="w-5 h-5 mr-2 group-hover:text-cyan-400 transition-colors" />
							Watch Preview
							<motion.span
								className="inline-block ml-2"
								animate={{ x: [0, 5, 0] }}
								transition={{ duration: 1.5, repeat: Infinity }}
							>
								→
							</motion.span>
						</Button>
					</motion.div>

					{/* Stats Row */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1 }}
						className="flex justify-center gap-8 md:gap-16 mb-16"
					>
						<AnimatedCounter value="50M+" label="Active Users" />
						<div className="w-px bg-white/10" />
						<AnimatedCounter value="100K+" label="Songs" />
						<div className="w-px bg-white/10" />
						<AnimatedCounter value="4K+" label="Movies" />
					</motion.div>
				</motion.div>

				{/* Category Dock */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.2, duration: 0.8 }}
					className="flex flex-wrap justify-center gap-3 md:gap-4 p-3 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md"
				>
					{categories.map((item, index) => (
						<motion.button
							key={item.label}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 1.4 + index * 0.1 }}
							whileHover={{ y: -6, scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={cn(
								"group flex flex-col items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer",
								"hover:bg-white/[0.05]",
								item.glow,
								"hover:shadow-xl",
							)}
						>
							<motion.div
								className={cn(
									"p-3 rounded-xl bg-gradient-to-br",
									item.color,
									"shadow-lg",
								)}
								whileHover={{ rotate: [0, -10, 10, 0] }}
								transition={{ duration: 0.5 }}
							>
								<item.icon className="w-5 h-5 text-white" />
							</motion.div>
							<span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500 group-hover:text-white transition-colors">
								{item.label}
							</span>
						</motion.button>
					))}
				</motion.div>
			</motion.div>

			{/* Bottom Gradient Fade */}
			<div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#030303] to-transparent z-20 pointer-events-none" />

			{/* Animated corner accents */}
			<motion.div
				className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-cyan-500/50 to-transparent"
				animate={{
					opacity: [0.3, 0.7, 0.3],
					height: ["100px", "150px", "100px"],
				}}
				transition={{ duration: 3, repeat: Infinity }}
			/>
			<motion.div
				className="absolute top-20 right-10 w-px h-32 bg-gradient-to-b from-purple-500/50 to-transparent"
				animate={{
					opacity: [0.3, 0.7, 0.3],
					height: ["100px", "150px", "100px"],
				}}
				transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
			/>
		</section>
	);
}
