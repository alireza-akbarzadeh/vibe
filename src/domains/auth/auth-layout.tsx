import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { MSG } from "@/constants/constants";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	subtitle: string;
}

export default function AuthLayout({
	children,
	title,
	subtitle,
}: AuthLayoutProps) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: (e.clientX / window.innerWidth - 0.5) * 30,
				y: (e.clientY / window.innerHeight - 0.5) * 30,
			});
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0">
				<div
					className="absolute inset-0 bg-linear-to-br from-purple-900/30 via-black to-cyan-900/20"
					style={{
						transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
						transition: "transform 0.3s ease-out",
					}}
				/>

				{/* Floating orbs */}
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.3, 1, 1.3],
						opacity: [0.15, 0.3, 0.15],
					}}
					transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
				/>

				{/* Grid overlay */}
				<div
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			{/* Back button */}
			<Link
				to="/"
				className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
			>
				<ArrowLeft className="w-5 h-5" />
				<span className="text-sm font-medium">Back</span>
			</Link>

			{/* Content */}
			<div className="relative z-10 w-full max-w-lg">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{/* Logo */}
					<div className="flex justify-center mb-8">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
								<Music className="w-6 h-6 text-white" />
							</div>
							<span className="text-2xl font-bold text-white">
								{MSG.APP_NAME}
							</span>
						</div>
					</div>

					{/* Title */}
					<div className="text-center mb-8">
						<h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
							{title}
						</h1>
						<p className="text-gray-400">{subtitle}</p>
					</div>

					{/* Glassmorphism card */}
					<div className="relative">
						<div className="absolute inset-0 bg-linear-to-br from-purple-600/10 to-cyan-600/10 rounded-3xl blur-xl" />
						<div className="relative bg-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
							{children}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
