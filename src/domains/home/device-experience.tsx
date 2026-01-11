import { motion } from "framer-motion";
import { Laptop, Smartphone, Tablet, Tv, Wifi } from "lucide-react";
import { MobileDevice } from "@/components/devices/mobile";
import { Image } from "@/components/ui/image";
import { Typography } from "@/components/ui/typography";
import { VideoProgressbar } from "@/components/video-payler/video-progressbar";

const devices = [
	{ icon: Smartphone, label: "Mobile", description: "iOS & Android" },
	{ icon: Tablet, label: "Tablet", description: "iPad & Android" },
	{ icon: Laptop, label: "Desktop", description: "Mac & Windows" },
	{ icon: Tv, label: "Smart TV", description: "All major brands" },
];

export default function DeviceExperience() {
	return (
		<section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
			{/* Background effects */}
			<div className="absolute inset-0">
				<motion.div
					animate={{
						rotate: [0, 360],
					}}
					transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200"
				>
					<div className="absolute inset-0 rounded-full border border-white/5" />
					<div className="absolute inset-10 rounded-full border border-white/5" />
					<div className="absolute inset-20 rounded-full border border-white/5" />
				</motion.div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-20"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 mb-6">
						<Wifi className="w-4 h-4 text-cyan-400" />
						<span className="text-sm text-gray-300">
							Seamless sync across all devices
						</span>
					</div>

					<Typography.H2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						One Account.{" "}
						<span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
							Everywhere.
						</span>
					</Typography.H2>
					<Typography.P className="text-gray-400 text-lg max-w-2xl mx-auto">
						Start on your phone, continue on your TV, finish on your laptop.
						Your experience follows you seamlessly.
					</Typography.P>
				</motion.div>

				{/* Device showcase */}
				<div className="relative">
					{/* Central device mockup */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="relative mx-auto w-full max-w-4xl"
					>
						{/* TV/Monitor mockup */}
						<div className="relative">
							<div className="aspect-video rounded-3xl bg-linear-to-br from-gray-800 to-gray-900 p-2 shadow-2xl shadow-purple-500/10">
								<div className="relative h-full rounded-2xl overflow-hidden bg-black">
									<Image
										src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop"
										alt="Streaming content"
										className="w-full h-full object-cover"
									/>

									{/* UI overlay */}
									<div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/30">
										{/* Top bar */}
										<div className="absolute top-4 left-4 right-4 flex justify-between items-center">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
													<span className="text-white font-bold text-lg">
														V
													</span>
												</div>
												<div className="hidden sm:block">
													<span className="text-white/60 text-sm">
														Now Playing
													</span>
												</div>
											</div>
										</div>

										{/* Bottom content */}
										<div className="absolute bottom-0 left-0 right-0 p-6">
											<Typography.H3 className="text-white text-2xl md:text-3xl font-bold mb-2">
												Interstellar
											</Typography.H3>
											<Typography.P className="text-white/60 text-sm mb-4">
												2014 • Sci-Fi • 2h 49m
											</Typography.P>

											{/* Progress bar */}
											<VideoProgressbar progress="65%" />

											<div className="flex justify-between text-white/50 text-xs">
												<span>1:48:32</span>
												<span>2:49:00</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Stand */}
							<div className="mx-auto w-32 h-6 bg-linear-to-b from-gray-700 to-gray-800 rounded-b-lg" />
							<div className="mx-auto w-48 h-2 bg-gray-800 rounded-full" />
						</div>

						{/* Mobile device */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.4, duration: 0.6 }}
							className="absolute -right-4 md:right-10 top-1/4 w-24 md:w-32"
						>
							<MobileDevice />
						</motion.div>
					</motion.div>
				</div>

				{/* Device icons grid */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.6, duration: 0.6 }}
					className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
				>
					{devices.map((device, index) => (
						<motion.div
							key={device.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
							className="group text-center p-6 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
						>
							<div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/2 mb-4 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300">
								<device.icon className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
							</div>
							<Typography.H3 className="text-white text-xl font-semibold mb-1">{device.label}</Typography.H3>
							<Typography.P className="text-gray-500 text-sm">{device.description}</Typography.P>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
