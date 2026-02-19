import {
	ChevronRight,
	Laptop,
	Play,
	Smartphone,
	Tablet,
	Tv,
	Wifi,
} from "lucide-react";
import { useId, useRef } from "react";
import { motion, useScroll, useTransform } from "@/components/motion";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";

// ─── Static progress bar for mockups ───────────────────────────
function MockProgress({
	progress,
	color = "bg-purple-500",
}: {
	progress: string;
	color?: string;
}) {
	return (
		<div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
			<motion.div
				className={`h-full rounded-full ${color}`}
				initial={{ width: 0 }}
				whileInView={{ width: progress }}
				viewport={{ once: true }}
				transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }}
			/>
		</div>
	);
}

// ─── TV / Monitor Mockup ──────────────────────────────────────
function TVMockup() {
	return (
		<div className="relative">
			{/* Screen bezel */}
			<div className="aspect-video rounded-2xl md:rounded-3xl bg-linear-to-br from-gray-800 to-gray-900 p-1 md:p-1.5 shadow-2xl shadow-purple-500/10 border border-white/8">
				<div className="relative h-full rounded-xl md:rounded-2xl overflow-hidden bg-black">
					<Image
						src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop"
						alt="Streaming on TV"
						className="w-full h-full object-cover"
					/>

					{/* Overlay UI */}
					<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-black/30">
						{/* Top bar */}
						<div className="absolute top-3 left-3 right-3 md:top-5 md:left-5 md:right-5 flex justify-between items-center">
							<div className="flex items-center gap-2">
								<div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
									<span className="text-white font-bold text-xs md:text-sm">
										V
									</span>
								</div>
								<span className="text-white/50 text-[10px] md:text-xs hidden sm:block">
									Now Playing
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
								<span className="text-green-400/80 text-[10px] md:text-xs font-medium">
									LIVE
								</span>
							</div>
						</div>

						{/* Bottom info */}
						<div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
							<Typography.H3 className="text-white text-sm md:text-xl lg:text-2xl font-bold mb-0.5 md:mb-1">
								Interstellar: Beyond Time
							</Typography.H3>
							<Typography.P className="text-white/50 text-[10px] md:text-sm mb-2 md:mb-3">
								2014 • Sci-Fi • 2h 49m
							</Typography.P>
							<MockProgress
								progress="65%"
								color="bg-linear-to-r from-purple-500 to-pink-500"
							/>
							<div className="flex justify-between text-white/40 text-[9px] md:text-xs mt-1">
								<span>1:48:32</span>
								<span>2:49:00</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Stand */}
			<div className="mx-auto w-20 md:w-32 h-2 md:h-3 bg-linear-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-lg" />
			<div className="mx-auto w-28 md:w-48 h-0.5 md:h-1 bg-gray-800 rounded-full" />
		</div>
	);
}

// ─── Mobile Mockup ─────────────────────────────────────────────
function MobileMockup() {
	return (
		<div className="w-full bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl md:rounded-3xl p-0.5 md:p-1 shadow-xl shadow-cyan-500/10 border border-white/8">
			{/* Notch */}
			<div className="relative">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 md:w-16 h-1.5 md:h-2 bg-black rounded-b-lg z-10" />
			</div>
			<div className="aspect-9/19 rounded-xl md:rounded-2xl overflow-hidden bg-black relative">
				<Image
					src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=800&fit=crop"
					alt="Mobile music stream"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent">
					{/* Mini player */}
					<div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
						<div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
							<div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-white/10 overflow-hidden shrink-0">
								<Image
									src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop"
									alt="track art"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-white text-[8px] md:text-[10px] font-medium truncate">
									Midnight Dreams
								</p>
								<p className="text-white/40 text-[7px] md:text-[9px] truncate">
									Luna Eclipse
								</p>
							</div>
							<motion.div
								animate={{ scale: [1, 1.15, 1] }}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
								className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0"
							>
								<Play className="w-2.5 h-2.5 md:w-3 md:h-3 text-white fill-white ml-0.5" />
							</motion.div>
						</div>
						<MockProgress
							progress="42%"
							color="bg-linear-to-r from-green-400 to-emerald-500"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Tablet Mockup ─────────────────────────────────────────────
function TabletMockup() {
	return (
		<div className="w-full bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl md:rounded-3xl p-0.5 md:p-1 shadow-xl shadow-indigo-500/10 border border-white/8">
			<div className="aspect-4/3 rounded-xl md:rounded-2xl overflow-hidden bg-black relative">
				<Image
					src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop"
					alt="Tablet browsing"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/40">
					{/* Category tags */}
					<div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1 md:gap-1.5">
						{["Trending", "Sci-Fi", "4K"].map((tag) => (
							<span
								key={tag}
								className="px-1.5 md:px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[7px] md:text-[9px] backdrop-blur-sm"
							>
								{tag}
							</span>
						))}
					</div>

					{/* Browsing grid overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
						<p className="text-white text-[9px] md:text-xs font-semibold mb-1 md:mb-1.5">
							Continue Watching
						</p>
						<div className="grid grid-cols-3 gap-1 md:gap-1.5">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="aspect-video rounded-md md:rounded-lg bg-white/5 overflow-hidden"
								>
									<div className="w-full h-full bg-linear-to-br from-purple-900/40 to-indigo-900/40" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Laptop Mockup ─────────────────────────────────────────────
function LaptopMockup() {
	return (
		<div className="w-full">
			{/* Screen */}
			<div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-t-xl md:rounded-t-2xl p-0.5 md:p-1 border border-b-0 border-white/8">
				<div className="aspect-16/10 rounded-t-lg md:rounded-t-xl overflow-hidden bg-black relative">
					<Image
						src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&h=560&fit=crop"
						alt="Laptop cinema"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30">
						{/* Dashboard-style overlay */}
						<div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
							<div className="flex items-end justify-between gap-2">
								<div className="flex-1 min-w-0">
									<Typography.P className="text-white text-[9px] md:text-sm font-semibold truncate">
										The Dark Knight
									</Typography.P>
									<Typography.P className="text-white/40 text-[8px] md:text-xs">
										Action • 2008
									</Typography.P>
								</div>
								<div className="flex items-center gap-1">
									<span className="text-amber-400 text-[9px] md:text-xs font-bold">
										9.0
									</span>
									<span className="text-white/30 text-[8px] md:text-[10px]">
										IMDb
									</span>
								</div>
							</div>
							<div className="mt-1.5">
								<MockProgress
									progress="28%"
									color="bg-linear-to-r from-amber-400 to-orange-500"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Keyboard base */}
			<div className="h-1.5 md:h-3 bg-linear-to-b from-gray-700 to-gray-800 rounded-b-lg mx-[-2%]" />
			<div className="mx-auto w-10 md:w-16 h-0.5 md:h-1 bg-gray-700 rounded-full mt-0.5" />
		</div>
	);
}

// ─── Floating particle ────────────────────────────────────────
function FloatingParticle({
	delay,
	x,
	y,
	size,
}: {
	delay: number;
	x: string;
	y: string;
	size: number;
}) {
	return (
		<motion.div
			className="absolute rounded-full bg-purple-500/20"
			style={{ left: x, top: y, width: size, height: size }}
			animate={{
				y: [0, -20, 0],
				opacity: [0.3, 0.7, 0.3],
				scale: [1, 1.3, 1],
			}}
			transition={{
				duration: 4 + delay,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
				delay,
			}}
		/>
	);
}

// ─── Connection line SVG ──────────────────────────────────────
function ConnectionLines() {
	const id = useId();
	const hubId = `${id}-hub`;
	const lineId = `${id}-line`;

	return (
		<svg
			className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
			viewBox="0 0 1000 600"
			fill="none"
			preserveAspectRatio="xMidYMid meet"
		>
			<title>Connection lines between devices</title>
			{/* Central hub glow */}
			<circle cx="500" cy="300" r="4" fill={`url(#${hubId})`} />
			<motion.circle
				cx="500"
				cy="300"
				r="12"
				fill="none"
				stroke={`url(#${hubId})`}
				strokeWidth="0.5"
				animate={{ r: [12, 30, 12], opacity: [0.8, 0, 0.8] }}
				transition={{
					duration: 3,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>

			{/* Lines from hub to each device */}
			{[
				{ x: 200, y: 180 }, // tablet (left)
				{ x: 500, y: 80 }, // TV (top center)
				{ x: 800, y: 180 }, // mobile (right)
				{ x: 500, y: 500 }, // laptop (bottom)
			].map((target, i) => (
				<motion.line
					// biome-ignore lint/suspicious/noArrayIndexKey: static layout
					key={i}
					x1="500"
					y1="300"
					x2={target.x}
					y2={target.y}
					stroke={`url(#${lineId})`}
					strokeWidth="0.5"
					strokeDasharray="4 4"
					initial={{ pathLength: 0, opacity: 0 }}
					whileInView={{ pathLength: 1, opacity: 0.5 }}
					viewport={{ once: true }}
					transition={{ delay: 0.8 + i * 0.2, duration: 0.8 }}
				/>
			))}

			{/* Travelling dots along lines */}
			{[
				{ x1: 500, y1: 300, x2: 200, y2: 180 },
				{ x1: 500, y1: 300, x2: 800, y2: 180 },
				{ x1: 500, y1: 300, x2: 500, y2: 80 },
				{ x1: 500, y1: 300, x2: 500, y2: 500 },
			].map((line, i) => (
				<motion.circle
					// biome-ignore lint/suspicious/noArrayIndexKey: static layout
					key={`dot-${i}`}
					r="2"
					fill={`url(#${hubId})`}
					animate={{
						cx: [line.x1, line.x2, line.x1],
						cy: [line.y1, line.y2, line.y1],
					}}
					transition={{
						duration: 3 + i * 0.5,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 1.5 + i * 0.4,
					}}
				/>
			))}

			<defs>
				<radialGradient id={hubId}>
					<stop offset="0%" stopColor="#a855f7" />
					<stop offset="100%" stopColor="#06b6d4" />
				</radialGradient>
				<linearGradient id={lineId} x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
					<stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
				</linearGradient>
			</defs>
		</svg>
	);
}

// ─── Device compatibility grid ────────────────────────────────
const supportedDevices = [
	{
		icon: Smartphone,
		label: "Mobile",
		sub: "iOS & Android",
		gradient: "from-green-400 to-emerald-500",
	},
	{
		icon: Tablet,
		label: "Tablet",
		sub: "iPad & Android",
		gradient: "from-indigo-400 to-blue-500",
	},
	{
		icon: Laptop,
		label: "Desktop",
		sub: "Mac & Windows",
		gradient: "from-amber-400 to-orange-500",
	},
	{
		icon: Tv,
		label: "Smart TV",
		sub: "All major brands",
		gradient: "from-purple-400 to-pink-500",
	},
];

// ─── Main export ──────────────────────────────────────────────
export default function DeviceExperienceSection() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	// Parallax values for each device
	const tvY = useTransform(scrollYProgress, [0, 1], [60, -60]);
	const mobileY = useTransform(scrollYProgress, [0, 1], [80, -40]);
	const tabletY = useTransform(scrollYProgress, [0, 1], [40, -80]);
	const laptopY = useTransform(scrollYProgress, [0, 1], [100, -30]);

	return (
		<section
			ref={sectionRef}
			className="relative py-24 md:py-32 bg-[#0a0a0a] overflow-hidden"
		>
			{/* ── Background effects ── */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Rotating rings */}
				<motion.div
					animate={{ rotate: [0, 360] }}
					transition={{
						duration: 120,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200"
				>
					<div className="absolute inset-0 rounded-full border border-white/3" />
					<div className="absolute inset-16 rounded-full border border-white/3" />
					<div className="absolute inset-32 rounded-full border border-white/3" />
					<div className="absolute inset-48 rounded-full border border-white/3" />
				</motion.div>

				{/* Ambient glow */}
				<div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
				<div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/8 rounded-full blur-3xl" />

				{/* Particles */}
				<FloatingParticle delay={0} x="15%" y="20%" size={4} />
				<FloatingParticle delay={1.2} x="80%" y="35%" size={3} />
				<FloatingParticle delay={0.5} x="60%" y="70%" size={5} />
				<FloatingParticle delay={2} x="25%" y="60%" size={3} />
				<FloatingParticle delay={0.8} x="70%" y="15%" size={4} />

				{/* Top divider */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-linear-to-r from-transparent via-purple-500/20 to-transparent" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
				{/* ── Section header ── */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
					className="text-center mb-16 md:mb-24"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 mb-6"
					>
						<Wifi className="w-4 h-4 text-cyan-400" />
						<span className="text-sm text-gray-300">
							Seamless sync across all devices
						</span>
					</motion.div>

					<Typography.H2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
						One Account.{" "}
						<span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
							Every Screen.
						</span>
					</Typography.H2>
					<Typography.P className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
						Start on your phone, continue on your TV, finish on your laptop.
						Your experience follows you seamlessly across every device.
					</Typography.P>
				</motion.div>

				{/* ── Device showcase — 4 devices in a creative layout ── */}
				<div className="relative max-w-5xl mx-auto">
					<ConnectionLines />

					{/* TV — center top, largest */}
					<motion.div
						style={{ y: tvY }}
						initial={{ opacity: 0, scale: 0.85 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.9, ease: "easeOut" }}
						className="relative z-10 mx-auto w-full max-w-3xl"
					>
						<TVMockup />
						{/* Label */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.5, duration: 0.5 }}
							className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/20 backdrop-blur-md"
						>
							<Tv className="w-3 h-3 text-purple-400" />
							<span className="text-[10px] md:text-xs text-purple-300 font-medium">
								Smart TV
							</span>
						</motion.div>
					</motion.div>

					{/* Three devices row — mobile, tablet, laptop */}
					<div className="mt-8 md:mt-12 grid grid-cols-3 gap-3 md:gap-8 items-end max-w-4xl mx-auto">
						{/* Tablet — left */}
						<motion.div
							style={{ y: tabletY }}
							initial={{ opacity: 0, x: -60, rotateY: 15 }}
							whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
							className="relative z-10"
						>
							<TabletMockup />
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.8, duration: 0.5 }}
								className="mt-2 md:mt-3 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 backdrop-blur-md w-fit mx-auto"
							>
								<Tablet className="w-3 h-3 text-indigo-400" />
								<span className="text-[10px] md:text-xs text-indigo-300 font-medium">
									Tablet
								</span>
							</motion.div>
						</motion.div>

						{/* Laptop — center */}
						<motion.div
							style={{ y: laptopY }}
							initial={{ opacity: 0, y: 60 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
							className="relative z-10"
						>
							<LaptopMockup />
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 1, duration: 0.5 }}
								className="mt-2 md:mt-3 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 backdrop-blur-md w-fit mx-auto"
							>
								<Laptop className="w-3 h-3 text-amber-400" />
								<span className="text-[10px] md:text-xs text-amber-300 font-medium">
									Desktop
								</span>
							</motion.div>
						</motion.div>

						{/* Mobile — right */}
						<motion.div
							style={{ y: mobileY }}
							initial={{ opacity: 0, x: 60, rotateY: -15 }}
							whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
							className="relative z-10 mx-auto w-2/3"
						>
							<MobileMockup />
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.9, duration: 0.5 }}
								className="mt-2 md:mt-3 flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/20 backdrop-blur-md w-fit mx-auto"
							>
								<Smartphone className="w-3 h-3 text-green-400" />
								<span className="text-[10px] md:text-xs text-green-300 font-medium">
									Mobile
								</span>
							</motion.div>
						</motion.div>
					</div>

					{/* Sync indicator — animated pulse between devices */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 1.2, duration: 0.6 }}
						className="mt-10 md:mt-16 flex items-center justify-center gap-3"
					>
						<motion.div
							className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
							animate={{
								boxShadow: [
									"0 0 0 0 rgba(168,85,247,0)",
									"0 0 0 8px rgba(168,85,247,0.08)",
									"0 0 0 0 rgba(168,85,247,0)",
								],
							}}
							transition={{
								duration: 3,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						>
							<motion.div
								className="w-2 h-2 rounded-full bg-linear-to-r from-purple-400 to-cyan-400"
								animate={{ scale: [1, 1.4, 1] }}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
							/>
							<span className="text-sm text-gray-300 font-medium">
								All devices synced in real-time
							</span>
							<ChevronRight className="w-4 h-4 text-gray-500" />
						</motion.div>
					</motion.div>
				</div>

				{/* ── Device compatibility grid ── */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4, duration: 0.7 }}
					className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-3xl mx-auto"
				>
					{supportedDevices.map((device, index) => (
						<motion.div
							key={device.label}
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true }}
							transition={{
								delay: 0.5 + index * 0.1,
								duration: 0.5,
								type: "spring",
								stiffness: 200,
							}}
							whileHover={{ y: -4, transition: { duration: 0.2 } }}
							className="group relative text-center p-4 md:p-6 rounded-2xl bg-white/3 border border-white/6 hover:bg-white/6 hover:border-white/12 transition-colors duration-300 cursor-default"
						>
							{/* Hover glow */}
							<div
								className={`absolute inset-0 rounded-2xl bg-linear-to-br ${device.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
							/>

							<div
								className={`inline-flex p-3 md:p-4 rounded-2xl bg-linear-to-br ${device.gradient} mb-3 md:mb-4 shadow-lg`}
							>
								<device.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
							</div>
							<Typography.H3 className="text-white text-base md:text-lg font-semibold mb-0.5">
								{device.label}
							</Typography.H3>
							<Typography.P className="text-gray-500 text-xs md:text-sm">
								{device.sub}
							</Typography.P>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
