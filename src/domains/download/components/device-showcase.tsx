import { Info, Play, Star } from "lucide-react";
import { motion } from "@/components/motion";
import type { Platform } from "../download.domain";

// --- Verified Cinematic Assets ---
const HERO_IMAGE =
	"https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=A%20sprawling%20sci-fi%20cityscape%20at%20dusk%2C%20with%20glowing%20neon%20signs%20and%20flying%20vehicles%2C%20in%20a%20cinematic%2C%20moody%20style&image_size=landscape_16_9";

const MOVIE_POSTERS = [
	"https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=A%20lone%20astronaut%20gazing%20at%20a%20colorful%20nebula%2C%20in%20a%20mysterious%20and%20awe-inspiring%20style&image_size=portrait_4_3",
	"https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=A%20futuristic%20cyborg%20detective%20in%20a%20rain-soaked%20city%2C%20rendered%20in%20a%20dark%2C%20noir%20style%20with%20vibrant%20neon%20highlights&image_size=portrait_4_3",
	"https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=An%20ancient%2C%20mystical%20forest%20with%20giant%2C%20glowing%20mushrooms%20and%20fantastical%20creatures%2C%20in%20a%20magical%20and%20enchanting%20style&image_size=portrait_4_3",
	"https://core-normal.traeapi.us/api/ide/v1/text_to_image?prompt=A%20high-speed%20chase%20with%20flying%20cars%20through%20a%20cyberpunk%20metropolis%2C%20in%20a%20dynamic%20and%20action-packed%20style&image_size=portrait_4_3",
];

const ShowcaseWrapper = ({
	accent,
	children,
}: {
	accent: string;
	children: React.ReactNode;
}) => (
	<div className="relative group">
		<motion.div
			style={{ "--accent": accent } as React.CSSProperties}
			className="absolute -inset-2 bg-[radial-gradient(ellipse_at_center,var(--accent),transparent_40%)] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
			initial={{ scale: 0.9, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ type: "spring", damping: 30, stiffness: 100 }}
		/>
		{children}
	</div>
);

export function DeviceShowcase({ platform }: { platform: Platform }) {
	if (platform.type === "tv") {
		return (
			<ShowcaseWrapper accent={platform.accent}>
				<div className="relative w-[340px] h-[200px] md:w-[680px] md:h-[380px] bg-black rounded-lg border-[12px] border-[#1a1a1a] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
					<AppInterface />
					<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 h-2 bg-[#2a2a2a] rounded-t-2xl shadow-inner" />
				</div>
			</ShowcaseWrapper>
		);
	}

	if (platform.type === "mobile") {
		return (
			<ShowcaseWrapper accent={platform.accent}>
				<div className="relative w-[260px] h-[540px] rounded-[3.5rem] border-[10px] border-[#1a1a1a] bg-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden ring-1 ring-white/10">
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#1a1a1a] rounded-b-[1.5rem] z-20 flex items-center justify-center gap-2">
						<div className="w-8 h-1 bg-white/5 rounded-full" />
						<div className="w-2 h-2 bg-white/5 rounded-full" />
					</div>
					<AppInterface isMobile />
					<div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/20 rounded-full" />
				</div>
			</ShowcaseWrapper>
		);
	}

	return (
		<ShowcaseWrapper accent={platform.accent}>
			<div className="relative w-[320px] h-[220px] md:w-[620px] md:h-[380px] bg-black rounded-2xl border border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] overflow-hidden">
				<div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-[#0a0a0a]">
					<div className="w-2.5 h-2.5 rounded-full bg-white/10" />
					<div className="w-2.5 h-2.5 rounded-full bg-white/10" />
					<div className="w-2.5 h-2.5 rounded-full bg-white/10" />
				</div>
				<AppInterface />
			</div>
		</ShowcaseWrapper>
	);
}

const AppInterface = ({ isMobile = false }) => (
	<div className="flex flex-col h-full w-full bg-black text-left overflow-hidden select-none">
		{/* Nav Bar Mockup */}
		<div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50 backdrop-blur-md">
			<div className="flex items-center gap-2">
				<div className="w-5 h-5 bg-purple-600 rounded-md flex items-center justify-center">
					<Play className="w-3 h-3 text-white fill-current" />
				</div>
				<div className="w-16 h-2 bg-white/20 rounded-full hidden md:block" />
			</div>
			<div className="flex gap-2">
				<div className="w-4 h-4 rounded-full bg-white/10" />
				<div className="w-4 h-4 rounded-full bg-white/10" />
			</div>
		</div>

		{/* Main Content */}
		<div className="relative flex-1 overflow-hidden">
			{/* Hero Feature */}
			<div
				className={`relative w-full ${isMobile ? "h-48" : "h-64"} overflow-hidden`}
			>
				<img
					src={HERO_IMAGE}
					className="w-full h-full object-cover"
					alt="Featured"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
				<div className="absolute bottom-4 left-4 right-4">
					<div className="flex items-center gap-2 mb-2">
						<span className="px-1.5 py-0.5 rounded bg-yellow-500 text-[8px] font-bold text-black uppercase">
							Trending
						</span>
						<div className="flex items-center gap-1">
							<Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
							<span className="text-[10px] text-white/80 font-medium">4.9</span>
						</div>
					</div>
					<h3
						className={`font-bold text-white mb-2 ${isMobile ? "text-sm" : "text-xl"}`}
					>
						Cinematic Universe
					</h3>
					<div className="flex gap-2">
						<div className="px-3 py-1 bg-white text-black rounded text-[9px] font-bold flex items-center gap-1">
							<Play className="w-2 h-2 fill-current" /> Play
						</div>
						<div className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded text-[9px] font-bold flex items-center gap-1">
							<Info className="w-2 h-2" /> Details
						</div>
					</div>
				</div>
			</div>

			{/* Animated Movie Shelf */}
			<div className="p-4">
				<div className="w-20 h-2 bg-white/20 rounded-full mb-3" />
				<div className="relative overflow-hidden">
					<motion.div
						className="flex gap-3"
						animate={{ x: ["0%", "-100%"] }}
						transition={{
							duration: 30,
							repeat: Infinity,
							ease: "linear",
							repeatType: "loop",
						}}
					>
						{[...MOVIE_POSTERS, ...MOVIE_POSTERS].map((src, i) => (
							<div
								key={`${src}-${i}`}
								className={`${isMobile ? "w-24" : "w-32"} aspect-[2/3] rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10`}
							>
								<img
									src={src}
									className="w-full h-full object-cover"
									alt="Movie Poster"
								/>
							</div>
						))}
					</motion.div>
				</div>
			</div>
		</div>
	</div>
);
