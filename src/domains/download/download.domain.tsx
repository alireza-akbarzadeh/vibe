import {
	Activity,
	Apple,
	ArrowRight,
	Cast,
	CheckCircle2,
	Clock,
	Cpu,
	Download,
	HardDrive,
	Monitor,
	ShieldCheck,
	Smartphone,
	Sparkles,
	Tv,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "@/components/motion";
import { DeviceShowcase } from "./components/device-showcase";
import { DownloadHero } from "./components/download-hero";

// --- Types ---

export type PlatformId =
	| "windows"
	| "macos"
	| "tvos"
	| "ios"
	| "android"
	| "web";

export interface Platform {
	id: PlatformId;
	name: string;
	icon: React.ElementType;
	version: string;
	fileSize: string;
	downloadUrl: string;
	requirements: {
		os: string;
		cpu: string;
		storage: string;
	};
	accent: string;
	description: string;
	type: "desktop" | "mobile" | "tv";
}

interface ReleaseNote {
	version: string;
	date: string;
	changes: { type: "feat" | "fix" | "perf"; text: string }[];
}

// --- Static Data ---

const PLATFORMS: Platform[] = [
	{
		id: "macos",
		name: "macOS",
		icon: Apple,
		version: "v2.4.0",
		fileSize: "112 MB",
		downloadUrl: "#",
		requirements: {
			os: "macOS 11.0+",
			cpu: "M1/M2/M3 or Intel",
			storage: "500MB",
		},
		accent: "#a855f7",
		type: "desktop",
		description: "Native M3 optimization with full spatial audio support.",
	},
	{
		id: "windows",
		name: "Windows",
		icon: Monitor,
		version: "v2.4.0",
		fileSize: "95 MB",
		downloadUrl: "#",
		requirements: { os: "Windows 10/11", cpu: "x64 2.0GHz+", storage: "450MB" },
		accent: "#0ea5e9",
		type: "desktop",
		description: "DirectX 12 powered streaming for low-latency playback.",
	},
	{
		id: "tvos",
		name: "Smart TV",
		icon: Tv,
		version: "v1.8.0",
		fileSize: "App Store",
		downloadUrl: "#",
		requirements: {
			os: "tvOS / Android TV",
			cpu: "Quad-Core ARM",
			storage: "120MB",
		},
		accent: "#f59e0b",
		type: "tv",
		description:
			"Cinematic 4K experience designed for the big screen and remote navigation.",
	},
	{
		id: "ios",
		name: "iPhone",
		icon: Smartphone,
		version: "v2.4.1",
		fileSize: "64 MB",
		downloadUrl: "#",
		requirements: { os: "iOS 15.0+", cpu: "A12 Bionic+", storage: "200MB" },
		accent: "#ec4899",
		type: "mobile",
		description: "Your entire library, optimized for ProMotion displays.",
	},
	{
		id: "android",
		name: "Android",
		icon: Smartphone,
		version: "v2.4.1",
		fileSize: "72 MB",
		downloadUrl: "#",
		requirements: {
			os: "Android 10+",
			cpu: "Snapdragon 8++",
			storage: "220MB",
		},
		accent: "#22c55e",
		type: "mobile",
		description: "High-fidelity audio streaming on any Android device.",
	},
];

const RECENT_RELEASES: ReleaseNote[] = [
	{
		version: "2.4.0",
		date: "Jan 24, 2026",
		changes: [
			{ type: "feat", text: "Introduced spatial audio support for desktop" },
			{ type: "perf", text: "Reduced memory usage during 4K playback by 20%" },
			{ type: "fix", text: "Resolved flickering on Windows HDR displays" },
		],
	},
	{
		version: "2.3.9",
		date: "Jan 10, 2026",
		changes: [
			{ type: "fix", text: "Improved login stability on unstable connections" },
			{ type: "feat", text: "New 'Compact Mode' for desktop players" },
		],
	},
];

// --- Main Page ---

export function DownloadPage() {
	const [activePlatform, setActivePlatform] = useState<PlatformId>("macos");

	const current =
		PLATFORMS.find((p) => p.id === activePlatform) || PLATFORMS[0];

	return (
		<div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
			{/* --- Background -- */}
			<motion.div
				key={current.id}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1.5 }}
				style={{ "--accent": current.accent } as React.CSSProperties}
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent),transparent_60%)] opacity-20 z-0 pointer-events-none"
			/>

			<DownloadHero />

			<section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
				{/* 1. INTERACTIVE SHOWCASE */}
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					viewport={{ once: true, amount: 0.2 }}
					className="flex flex-col items-center mb-40"
				>
					<div className="relative min-h-[550px] w-full flex items-center justify-center mb-16">
						<AnimatePresence mode="wait">
							<motion.div
								key={current.id}
								initial={{ y: 30, opacity: 0, scale: 0.9 }}
								animate={{ y: 0, opacity: 1, scale: 1 }}
								exit={{ y: -30, opacity: 0, scale: 0.9 }}
								transition={{ type: "spring", damping: 25, stiffness: 120 }}
							>
								<DeviceShowcase platform={current} />
							</motion.div>
						</AnimatePresence>
					</div>

					<div className="inline-flex p-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full mb-12 flex-wrap justify-center shadow-2xl">
						{PLATFORMS.map((p) => (
							<button
								key={p.id}
								onClick={() => setActivePlatform(p.id)}
								className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${activePlatform === p.id ? "text-white" : "text-gray-400 hover:text-white"}`}
							>
								{activePlatform === p.id && (
									<motion.div
										layoutId="pill"
										style={{ "--accent": p.accent } as React.CSSProperties}
										className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_20px_0_var(--accent)]"
									/>
								)}
								<p.icon className="w-4 h-4 relative z-10" />
								<span className="relative z-10">{p.name}</span>
							</button>
						))}
					</div>

					<div className="text-center max-w-2xl">
						<h2 className="text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
							{current.type === "tv"
								? "Stream on the Big Screen"
								: `Ready for ${current.name}`}
						</h2>
						<p className="text-gray-400 mb-10 text-lg leading-relaxed">
							{current.description}
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-5">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								style={{ "--accent": current.accent } as React.CSSProperties}
								className="bg-[var(--accent)] text-white px-10 py-4 rounded-full font-bold transition-transform flex items-center gap-3 shadow-[0_10px_30px_-10px_var(--accent)]"
							>
								{current.type === "tv" ? (
									<Cast className="w-5 h-5" />
								) : (
									<Download className="w-5 h-5" />
								)}
								{current.type === "tv"
									? "Available on App Store"
									: "Download Now"}
							</motion.button>
							<div className="flex flex-col items-start text-left">
								<div className="flex items-center gap-2 text-sm text-green-400 font-semibold uppercase tracking-wider">
									<ShieldCheck className="w-4 h-4 text-green-400" /> Verified Build
								</div>
								<span className="text-[11px] text-gray-500">
									{current.version} • {current.fileSize}
								</span>
							</div>
						</div>
					</div>
				</motion.div>

				{/* 2. SYSTEM REQUIREMENTS */}
				<div className="grid lg:grid-cols-2 gap-20 mb-40">
					<div className="space-y-8">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
								<Activity className="w-3 h-3" /> System Requirements
							</div>
							<h2 className="text-4xl font-bold mb-6 tracking-tight">
								Optimized for your hardware.
							</h2>
							<p className="text-gray-400 leading-relaxed">
								We leverage native APIs to ensure the smoothest performance and
								minimal battery drain on every device.
							</p>
						</div>

						<div className="grid gap-4">
							{[
								{
									icon: Monitor,
									label: "OS Version",
									value: current.requirements.os,
								},
								{
									icon: Cpu,
									label: "Processor",
									value: current.requirements.cpu,
								},
								{
									icon: HardDrive,
									label: "Disk Space",
									value: current.requirements.storage,
								},
							].map((spec) => (
								<div
									key={spec.value}
									className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10"
								>
									<div className="flex items-center gap-4 text-left">
										<div className="p-2 rounded-lg bg-white/5">
											<spec.icon className="w-5 h-5 text-gray-400" />
										</div>
										<span className="text-sm text-gray-400 font-medium">
											{spec.label}
										</span>
									</div>
									<span className="text-sm font-bold text-white">
										{spec.value}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="relative group">
						<div className="absolute -inset-1 bg-linear-to-r from-purple-500 to-blue-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition" />
						<div className="relative bg-[#0a0a0a] p-10 rounded-[2.4rem] border border-white/10 h-full flex flex-col justify-between">
							<div>
								<ShieldCheck className="w-12 h-12 text-purple-500 mb-8" />
								<h3 className="text-2xl font-bold mb-4">Verified Security</h3>
								<p className="text-gray-400 leading-relaxed mb-8">
									All downloads are signed with an EV certificate and scanned
									against major antivirus engines.
								</p>
							</div>
							<div className="space-y-4">
								<div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
									<div className="h-full w-full bg-purple-500" />
								</div>
								<div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
									<span>Audit: Passed</span>
									<span>Stable Release</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 3. RELEASE NOTES / CHANGELOG */}
				<div className="pt-20 border-t border-white/10">
					<div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
						<div className="max-w-md text-left">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-4">
								<Sparkles className="w-3 h-3" /> Changelog
							</div>
							<h2 className="text-4xl font-bold tracking-tight">What's New</h2>
						</div>
						<button className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
							View Full History <ArrowRight className="w-4 h-4" />
						</button>
					</div>

					<div className="grid gap-6">
						{RECENT_RELEASES.map((release) => (
							<div
								key={release.version}
								className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
							>
								<div className="flex flex-wrap items-center justify-between gap-4 mb-8">
									<div className="flex items-center gap-4">
										<span className="text-2xl font-bold font-mono">
											v{release.version}
										</span>
										<span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-tighter">
											Latest Release
										</span>
									</div>
									<div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
										<Clock className="w-3.5 h-3.5" /> {release.date}
									</div>
								</div>
								<div className="space-y-4 max-w-3xl text-left">
									{release.changes.map((change) => (
										<div key={change.text} className="flex gap-4">
											<div
												className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${change.type === "feat" ? "bg-purple-500" : change.type === "fix" ? "bg-blue-500" : "bg-green-500"}`}
											/>
											<p className="text-gray-400 leading-relaxed text-sm">
												<span className="text-gray-200 font-medium capitalize">
													{change.type}:{" "}
												</span>
												{change.text}
											</p>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
