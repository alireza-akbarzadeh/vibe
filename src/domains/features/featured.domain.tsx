import {
	ArrowRight,
	Check,
	Download,
	Film,
	Headphones,
	MonitorSpeaker,
	Music,
	Radio,
	Shield,
	Smartphone,
	Sparkles,
	Tv,
	Users,
	Wifi,
	Zap,
} from "lucide-react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { CheckItem } from "./components/check-item";
import { DeviceCard } from "./components/device-card";
import { FeatureCard } from "./components/feature-card";
import { SmallCard } from "./components/small-card";
import { SocialSecurityCard } from "./components/social-security-card";

export function FeaturesPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				{/* Animated background */}
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-linear-to-br from-purple-900/30 via-black to-pink-900/20" />
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.5, 0.3],
						}}
						transition={{ duration: 8, repeat: Infinity }}
						className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
					/>
					<motion.div
						animate={{
							scale: [1.2, 1, 1.2],
							opacity: [0.2, 0.4, 0.2],
						}}
						transition={{ duration: 10, repeat: Infinity }}
						className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
					/>
				</div>

				<div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 pb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
					>
						<Zap className="w-4 h-4 text-purple-400" />
						<span className="text-sm text-gray-300">Powerful Features</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.1 }}
						className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
					>
						Everything you need
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="text-xl text-gray-400 max-w-2xl mx-auto mb-12"
					>
						From lossless audio to 4K video, offline downloads to social
						sharing. Experience entertainment like never before.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="flex flex-col sm:flex-row items-center justify-center gap-4"
					>
						<Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-6 text-lg rounded-full">
							Start Free Trial
							<ArrowRight className="w-5 h-5 ml-2" />
						</Button>
						<Button
							variant="outline"
							className="border-white/20 hover:bg-white/5 px-8 py-6 text-lg rounded-full"
						>
							Compare Plans
						</Button>
					</motion.div>
				</div>
			</section>

			{/* Main Features Grid */}
			<section className="relative py-32 px-6 overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-20"
					>
						<span className="text-sm uppercase tracking-widest text-purple-400 mb-4 block">
							Core Features
						</span>
						<h2 className="text-5xl md:text-6xl font-bold mb-4">
							Two platforms,{" "}
							<span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
								one experience
							</span>
						</h2>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-8 mb-32">
						{/* Music Feature */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="group relative"
						>
							<div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
							<div className="relative bg-linear-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 h-full">
								<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6">
									<Headphones className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-4xl font-bold mb-4">Music Streaming</h3>
								<p className="text-gray-400 text-lg mb-8 leading-relaxed">
									Access over 50 million songs with lossless audio quality.
									Create playlists, discover new artists, and enjoy music like
									never before.
								</p>
								<div className="flex flex-wrap gap-3">
									<span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
										Lossless Audio
									</span>
									<span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
										Spatial Audio
									</span>
									<span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
										Live Lyrics
									</span>
								</div>
							</div>
						</motion.div>

						{/* Video Feature */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="group relative"
						>
							<div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
							<div className="relative bg-linear-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 h-full">
								<div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6">
									<Tv className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-4xl font-bold mb-4">Video Streaming</h3>
								<p className="text-gray-400 text-lg mb-8 leading-relaxed">
									Watch movies, series, and exclusive content in stunning 4K
									HDR. Your personal cinema, anywhere you go.
								</p>
								<div className="flex flex-wrap gap-3">
									<span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
										4K HDR
									</span>
									<span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
										Dolby Atmos
									</span>
									<span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
										Subtitles
									</span>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Streaming Quality */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<span className="text-sm uppercase tracking-widest text-purple-400 mb-4 block">
							Premium Quality
						</span>
						<h2 className="text-4xl md:text-5xl font-bold">
							Experience entertainment the right way
						</h2>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-6 mb-32">
						<FeatureCard
							icon={<Radio className="w-7 h-7" />}
							title="Lossless Audio"
							description="Stream music in CD-quality and Hi-Res audio up to 24-bit/192kHz"
							delay={0.1}
						/>
						<FeatureCard
							icon={<Film className="w-7 h-7" />}
							title="4K Ultra HD"
							description="Watch content in stunning 4K with HDR10 and Dolby Vision"
							delay={0.2}
						/>
						<FeatureCard
							icon={<MonitorSpeaker className="w-7 h-7" />}
							title="Spatial Audio"
							description="Immerse yourself in 3D sound with Dolby Atmos support"
							delay={0.3}
						/>
					</div>
				</div>
			</section>

			{/* Offline Downloads */}
			<section className="relative py-32 px-6 bg-gradient-to-b from-black via-purple-950/10 to-black">
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<span className="text-sm uppercase tracking-widest text-purple-400 mb-4 block">
								Offline Mode
							</span>
							<h2 className="text-5xl font-bold mb-6 leading-tight">
								Download and enjoy{" "}
								<span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
									offline
								</span>
							</h2>
							<p className="text-gray-400 text-lg mb-8 leading-relaxed">
								Going somewhere without internet? Download your favorite music
								and videos to enjoy offline. Perfect for flights, commutes, or
								anywhere.
							</p>
							<ul className="space-y-4">
								<CheckItem text="Unlimited downloads with Premium" />
								<CheckItem text="Smart download for favorite content" />
								<CheckItem text="Multiple quality levels available" />
							</ul>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl" />
							<div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
										<Download className="w-8 h-8" />
									</div>
									<div>
										<div className="text-3xl font-bold">2,458</div>
										<div className="text-gray-400">Songs downloaded</div>
									</div>
								</div>
								<div className="space-y-3">
									<div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
												<Music className="w-5 h-5 text-purple-400" />
											</div>
											<div>
												<div className="font-medium">Chill Vibes Playlist</div>
												<div className="text-sm text-gray-400">45 songs</div>
											</div>
										</div>
										<Check className="w-5 h-5 text-green-400" />
									</div>
									<div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
												<Film className="w-5 h-5 text-blue-400" />
											</div>
											<div>
												<div className="font-medium">Watchlist Movies</div>
												<div className="text-sm text-gray-400">12 movies</div>
											</div>
										</div>
										<Check className="w-5 h-5 text-green-400" />
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Personalization */}
			<section className="py-32 px-6">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<span className="text-sm uppercase tracking-widest text-purple-400 mb-4 block">
							Personalization
						</span>
						<h2 className="text-5xl font-bold mb-4">
							Made{" "}
							<span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
								just for you
							</span>
						</h2>
						<p className="text-gray-400 text-lg max-w-2xl mx-auto">
							Our AI learns your taste and surfaces content you'll love
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<SmallCard
							icon={<Sparkles className="w-6 h-6" />}
							title="AI Recommendations"
							description="Smart suggestions based on your habits"
							delay={0.1}
						/>
						<SmallCard
							icon={<Music className="w-6 h-6" />}
							title="Daily Mixes"
							description="Fresh playlists generated daily"
							delay={0.2}
						/>
						<SmallCard
							icon={<Radio className="w-6 h-6" />}
							title="Artist Radio"
							description="Discover similar artists"
							delay={0.3}
						/>
						<SmallCard
							icon={<Tv className="w-6 h-6" />}
							title="Watch Next"
							description="Personalized video recommendations"
							delay={0.4}
						/>
					</div>
				</div>
			</section>

			{/* Multi-Device */}
			<section className="py-32 px-6 bg-gradient-to-b from-black via-purple-950/10 to-black">
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="order-2 lg:order-1"
						>
							<div className="grid grid-cols-2 gap-4">
								<DeviceCard icon={<Smartphone />} label="Mobile" />
								<DeviceCard icon={<Tv />} label="Smart TV" />
								<DeviceCard icon={<MonitorSpeaker />} label="Desktop" />
								<div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square">
									<Wifi className="w-10 h-10 mb-2" />
									<span className="text-sm font-medium">All Synced</span>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="order-1 lg:order-2"
						>
							<span className="text-sm uppercase tracking-widest text-purple-400 mb-4 block">
								Multi-Device
							</span>
							<h2 className="text-5xl font-bold mb-6 leading-tight">
								Seamless across{" "}
								<span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
									all devices
								</span>
							</h2>
							<p className="text-gray-400 text-lg mb-8 leading-relaxed">
								Start on your phone, continue on your TV, finish on your laptop.
								Everything stays in sync across all your devices.
							</p>
							<ul className="space-y-4">
								<CheckItem text="Up to 6 devices per account" />
								<CheckItem text="Instant playback sync" />
								<CheckItem text="Remote control from any device" />
							</ul>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Social & Security */}
			<section className="py-32 px-6">
				<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
					<SocialSecurityCard
						icon={<Users className="w-8 h-8" />}
						title="Social Features"
						description="Share playlists, see what friends are listening to, and discover content through your network"
						features={[
							"Share playlists with friends",
							"Collaborative playlists",
							"Live listening sessions",
						]}
						gradient="from-purple-600/20 to-pink-600/20"
						delay={0.1}
					/>
					<SocialSecurityCard
						icon={<Shield className="w-8 h-8" />}
						title="Privacy & Security"
						description="Your data is yours. Industry-leading security to keep your information safe and private"
						features={[
							"End-to-end encryption",
							"No ads, no tracking",
							"Parental controls",
						]}
						gradient="from-blue-600/20 to-cyan-600/20"
						delay={0.2}
					/>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-32 px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-4xl mx-auto text-center relative"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl blur-3xl" />
					<div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16">
						<h2 className="text-5xl font-bold mb-6">
							Ready to experience all features?
						</h2>
						<p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
							Start your free 30-day trial and unlock everything. No credit card
							required.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-6 text-lg rounded-full">
								Start Free Trial
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
							<Button
								variant="outline"
								className="border-white/20 hover:bg-white/5 px-8 py-6 text-lg rounded-full"
							>
								Compare Plans
							</Button>
						</div>
					</div>
				</motion.div>
			</section>
		</div>
	);
}
