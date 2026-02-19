import { Check, Target } from "lucide-react";
import { useId } from "react";
import { motion } from "@/components/motion";

interface ProgressTrackerProps {
	current: number;
	min: number;
	recommended: number;
}

export function ProgressTracker({
	current,
	min,
	recommended,
}: ProgressTrackerProps) {
	const progress = Math.min((current / recommended) * 100, 100);
	const isMinMet = current >= min;
	const isRecommendedMet = current >= recommended;
	const gradientId = useId();

	return (
		<div className="flex items-center gap-4">
			{/* Progress circle */}
			<div className="relative">
				<svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
					<title>Progress tracker circle</title>
					{/* Background circle */}
					<circle
						cx="50"
						cy="50"
						r="40"
						fill="none"
						stroke="rgba(255, 255, 255, 0.1)"
						strokeWidth="8"
					/>

					{/* Progress circle */}
					<motion.circle
						cx="50"
						cy="50"
						r="40"
						fill="none"
						stroke={`url(#${gradientId})`}
						strokeWidth="8"
						strokeLinecap="round"
						strokeDasharray={`${2 * Math.PI * 40}`}
						initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
						animate={{
							strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100),
						}}
						transition={{ duration: 0.5, ease: "easeOut" }}
					/>

					<defs>
						<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#8b5cf6" />
							<stop offset="50%" stopColor="#ec4899" />
							<stop offset="100%" stopColor="#06b6d4" />
						</linearGradient>
					</defs>
				</svg>

				{/* Center content */}
				<div className="absolute inset-0 flex items-center justify-center">
					{isRecommendedMet ? (
						<motion.div
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							<Check className="w-6 h-6 text-green-400" />
						</motion.div>
					) : (
						<span className="text-sm font-bold text-white">{current}</span>
					)}
				</div>
			</div>

			{/* Status text */}
			<div className="hidden md:block">
				<motion.div
					key={current}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex items-center gap-2"
				>
					{isRecommendedMet ? (
						<>
							<Check className="w-4 h-4 text-green-400" />
							<span className="text-sm font-medium text-green-400">
								Perfect!
							</span>
						</>
					) : isMinMet ? (
						<>
							<Target className="w-4 h-4 text-purple-400" />
							<span className="text-sm font-medium text-purple-400">
								{recommended - current} more for best results
							</span>
						</>
					) : (
						<>
							<Target className="w-4 h-4 text-gray-400" />
							<span className="text-sm font-medium text-gray-400">
								{min - current} more to continue
							</span>
						</>
					)}
				</motion.div>

				<div className="flex items-center gap-2 mt-1">
					<motion.div
						className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
						style={{ width: "120px" }}
					>
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${progress}%` }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="h-full bg-linear-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-full"
						/>
					</motion.div>
					<span className="text-xs text-gray-500">
						{current}/{recommended}
					</span>
				</div>
			</div>
		</div>
	);
}
