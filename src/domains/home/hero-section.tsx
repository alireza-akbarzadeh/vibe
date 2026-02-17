/** biome-ignore-all lint/suspicious/noArrayIndexKey: index keys fine for static lists */

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import {
	ChevronRight,
	Film,
	Headphones,
	Play,
	Star,
	TrendingUp,
	Tv,
	Volume2,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import type { MediaList } from "@/orpc/models/media.schema";
import { trendingQueryOptions } from "./home.queries";

// ─── Animated Number Counter ───────────────────────────────────
function AnimatedNumber({
	value,
	suffix = "",
	duration = 2,
}: { value: number; suffix?: string; duration?: number }) {
	const [display, setDisplay] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const [hasAnimated, setHasAnimated] = useState(false);

	useEffect(() => {
		if (hasAnimated) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setHasAnimated(true);
					const start = performance.now();
					const animate = (now: number) => {
						const elapsed = (now - start) / 1000;
						const progress = Math.min(elapsed / duration, 1);
						const eased = 1 - (1 - progress) ** 3;
						setDisplay(Math.floor(eased * value));
						if (progress < 1) requestAnimationFrame(animate);
					};
					requestAnimationFrame(animate);
				}
			},
			{ threshold: 0.3 },
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [value, duration, hasAnimated]);

	return (
		<span ref={ref}>
			{display.toLocaleString()}
			{suffix}
		</span>
	);
}

// ─── Audio Visualizer ──────────────────────────────────────────
function AudioVisualizer() {
	return (
		<div className="flex items-end gap-0.75 h-6">
			{[...Array(5)].map((_, i) => (
				<motion.div
					key={i}
					className="w-0.75 bg-linear-to-t from-cyan-500 to-blue-400 rounded-full"
					animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
					transition={{
						duration: 0.7,
						delay: i * 0.08,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
}

// ─── Spotlight Card (real trending movie) ──────────────────────
function SpotlightCard({
	movie,
	className,
	delay = 0,
}: {
	movie: MediaList;
	className?: string;
	delay?: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.85, y: 30 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
			whileHover={{ scale: 1.05, y: -8 }}
			className={cn(
				"absolute hidden lg:block w-36 h-52 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 group cursor-pointer z-10",
				className,
			)}
		>
			<Link to="/movies/$movieId" params={{ movieId: movie.id }}>
				<Image
					src={movie.thumbnail}
					alt={movie.title}
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
				<div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm">
					<Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
					<span className="text-[10px] text-white font-bold">
						{movie.rating?.toFixed(1) ?? "N/A"}
					</span>
				</div>
				<div className="absolute bottom-2 left-2 right-2">
					<div className="flex items-center gap-1 mb-0.5">
						{movie.type === "TRACK" ? (
							<Headphones className="w-2.5 h-2.5 text-cyan-400" />
						) : (
							<Film className="w-2.5 h-2.5 text-cyan-400" />
						)}
						<span className="text-[9px] text-cyan-400 uppercase tracking-wider font-medium">
							{movie.type === "TRACK" ? "Music" : "Movie"}
						</span>
					</div>
					<p className="text-[11px] font-semibold text-white truncate leading-tight">
						{movie.title}
					</p>
				</div>
				<motion.div
					className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
					animate={{ x: ["-100%", "200%"] }}
					transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
				/>
			</Link>
		</motion.div>
	);
}

// ─── Stat Item ─────────────────────────────────────────────────
function StatItem({
	icon,
	value,
	suffix,
	label,
}: { icon: React.ReactNode; value: number; suffix: string; label: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 1.0 }}
			className="text-center"
		>
			<div className="flex items-center justify-center gap-1.5 mb-1">
				{icon}
				<motion.div
					className="text-2xl md:text-3xl font-bold text-white"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", stiffness: 200, delay: 1.2 }}
				>
					<AnimatedNumber value={value} suffix={suffix} />
				</motion.div>
			</div>
			<div className="text-xs text-gray-500 uppercase tracking-wider">
				{label}
			</div>
		</motion.div>
	);
}

// ─── Main Hero ─────────────────────────────────────────────────
export default function HeroSection() {
	const [currentWord, setCurrentWord] = useState(0);
	const words = ["MUSIC", "MOVIES", "SHOWS", "LIVE"];
	const sectionRef = useRef<HTMLElement>(null);

	const { data: trendingData } = useQuery(trendingQueryOptions(8));
	const trendingItems = trendingData?.data?.items ?? [];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentWord((prev) => (prev + 1) % words.length);
		}, 2800);
		return () => clearInterval(interval);
	}, []);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const springConfig = { damping: 30, stiffness: 120 };
	const dx = useSpring(mouseX, springConfig);
	const dy = useSpring(mouseY, springConfig);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			mouseX.set((e.clientX / window.innerWidth - 0.5) * 60);
			mouseY.set((e.clientY / window.innerHeight - 0.5) * 60);
		},
		[mouseX, mouseY],
	);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [handleMouseMove]);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
	const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
	const rotateX = useTransform(dy, [-30, 30], [2, -2]);
	const rotateY = useTransform(dx, [-30, 30], [-2, 2]);

	return (
		<motion.section
			ref={sectionRef}
			style={{ opacity: heroOpacity, scale: heroScale }}
			className="relative min-h-screen w-full overflow-hidden bg-[#030303] selection:bg-cyan-500/30"
		>
			{/* Background */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),rgba(0,0,0,0))]" />
				<motion.div
					animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1], x: [0, 25, -15, 0], y: [0, -15, 25, 0] }}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[8%] left-[18%] w-112.5 h-112.5 rounded-full blur-[100px] bg-cyan-500/30"
				/>
				<motion.div
					animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.2, 1] }}
					transition={{ duration: 12, delay: 2, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[35%] right-[12%] w-87.5 h-87.5 rounded-full blur-[100px] bg-purple-500/25"
				/>
				<motion.div
					animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
					transition={{ duration: 8, delay: 4, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-[15%] left-[28%] w-70 h-70 rounded-full blur-[100px] bg-pink-500/20"
				/>
				<motion.div
					style={{ x: dx, y: dy, translateX: "-50%", translateY: "-50%" }}
					className="absolute top-1/2 left-1/2 w-175 h-175 bg-cyan-500/6 rounded-full blur-[150px]"
				/>
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_100%)]" />
				<div className="absolute inset-0 flex items-center justify-center">
					{[...Array(3)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-125 h-125 rounded-full border border-cyan-500/10"
							animate={{ opacity: [0, 0.4, 0], scale: [0.7, 1.6, 2.2] }}
							transition={{ duration: 5, delay: i * 1.5, repeat: Infinity, ease: "easeOut" }}
						/>
					))}
				</div>
			</div>

			{/* Floating spotlight cards */}
			{trendingItems.length >= 4 && (
				<>
					<SpotlightCard movie={trendingItems[0]} className="top-[14%] left-[6%] xl:left-[10%]" delay={0.6} />
					<SpotlightCard movie={trendingItems[1]} className="top-[20%] right-[6%] xl:right-[10%]" delay={0.8} />
					<SpotlightCard movie={trendingItems[2]} className="bottom-[28%] left-[8%] xl:left-[14%]" delay={1.0} />
					<SpotlightCard movie={trendingItems[3]} className="bottom-[26%] right-[7%] xl:right-[12%]" delay={1.2} />
				</>
			)}

			{/* Main Content */}
			<motion.div
				style={{ rotateX, rotateY, perspective: 1200 }}
				className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-20"
			>
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-center max-w-5xl">
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/4 backdrop-blur-xl border border-white/10 mb-10 shadow-2xl shadow-cyan-500/5"
					>
						<AudioVisualizer />
						<span className="text-xs tracking-[0.2em] uppercase text-gray-300 font-semibold">Now Streaming</span>
						<motion.div
							className="w-2 h-2 rounded-full bg-emerald-500"
							animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						/>
					</motion.div>

					{/* Headline */}
					<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.92]">
						<motion.span
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, delay: 0.3 }}
							className="text-white block"
						>
							STREAM YOUR
						</motion.span>
						<span className="relative h-[1.15em] flex items-center justify-center overflow-hidden">
							<AnimatePresence mode="wait">
								<motion.span
									key={currentWord}
									initial={{ y: 80, opacity: 0, rotateX: -45 }}
									animate={{ y: 0, opacity: 1, rotateX: 0 }}
									exit={{ y: -80, opacity: 0, rotateX: 45 }}
									transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
									className="absolute bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
								>
									{words[currentWord]}
								</motion.span>
							</AnimatePresence>
						</span>
					</h1>

					<motion.div
						initial={{ width: 0, opacity: 0 }}
						animate={{ width: "180px", opacity: 1 }}
						transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
						className="h-1 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full mx-auto mb-8"
					/>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.7 }}
						className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
					>
						Experience the next generation of entertainment with{" "}
						<span className="text-cyan-400 font-medium">spatial audio</span>,{" "}
						<span className="text-blue-400 font-medium">4K visuals</span>, and{" "}
						<span className="text-purple-400 font-medium">zero latency</span> streaming.
					</motion.p>

					{/* CTAs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.5 }}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14"
					>
						<Link to="/movies">
							<Button
								size="lg"
								className="h-14 px-8 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg font-bold group relative overflow-hidden shadow-lg shadow-cyan-500/25 border-0"
							>
								<motion.div
									className="absolute inset-0 bg-linear-to-r from-white/0 via-white/25 to-white/0"
									animate={{ x: ["-100%", "200%"] }}
									transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
								/>
								<span className="relative z-10 flex items-center gap-2">
									<Play className="w-5 h-5 fill-current" />
									Start Free Trial
								</span>
							</Button>
						</Link>
						<Link to="/pricing">
							<Button
								variant="ghost"
								size="lg"
								className="h-14 px-8 text-white/70 hover:text-white hover:bg-white/5 text-lg font-semibold group border border-white/10"
							>
								<Zap className="w-5 h-5 mr-2 group-hover:text-cyan-400 transition-colors" />
								View Plans
								<ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.9 }}
						className="flex justify-center gap-8 md:gap-16"
					>
						<StatItem icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} value={50000} suffix="+" label="Active Users" />
						<div className="w-px bg-white/10" />
						<StatItem icon={<Headphones className="w-4 h-4 text-purple-400" />} value={100000} suffix="+" label="Songs" />
						<div className="w-px bg-white/10" />
						<StatItem icon={<Film className="w-4 h-4 text-cyan-400" />} value={4000} suffix="+" label="Movies" />
					</motion.div>
				</motion.div>

				{/* Category Dock */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.1, duration: 0.7 }}
					className="mt-16 flex flex-wrap justify-center gap-3 md:gap-4 p-3 rounded-3xl bg-white/2 border border-white/5 backdrop-blur-md"
				>
					{[
						{ icon: Headphones, label: "Music", color: "from-blue-500 to-cyan-500" },
						{ icon: Film, label: "Cinema", color: "from-purple-500 to-pink-500" },
						{ icon: Tv, label: "Series", color: "from-emerald-500 to-teal-500" },
						{ icon: Volume2, label: "Podcasts", color: "from-pink-500 to-rose-500" },
					].map((item, index) => (
						<motion.div
							key={item.label}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 1.3 + index * 0.08 }}
							whileHover={{ y: -5, scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="flex flex-col items-center gap-2 px-5 py-3 rounded-2xl cursor-pointer hover:bg-white/5 transition-all duration-300"
						>
							<div className={cn("p-3 rounded-xl bg-linear-to-br shadow-lg", item.color)}>
								<item.icon className="w-5 h-5 text-white" />
							</div>
							<span className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">
								{item.label}
							</span>
						</motion.div>
					))}
				</motion.div>
			</motion.div>

			{/* Bottom fade + corner accents */}
			<div className="absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
			<motion.div
				className="absolute top-20 left-10 w-px h-32 bg-linear-to-b from-cyan-500/40 to-transparent"
				animate={{ opacity: [0.2, 0.6, 0.2], height: ["100px", "140px", "100px"] }}
				transition={{ duration: 4, repeat: Infinity }}
			/>
			<motion.div
				className="absolute top-20 right-10 w-px h-32 bg-linear-to-b from-purple-500/40 to-transparent"
				animate={{ opacity: [0.2, 0.6, 0.2], height: ["100px", "140px", "100px"] }}
				transition={{ duration: 4, repeat: Infinity, delay: 2 }}
			/>
		</motion.section>
	);
}
