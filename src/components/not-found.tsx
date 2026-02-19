import { memo } from "react";
import BackButton from "@/components/back-button";
import { motion } from "@/components/motion";
import { Typography } from "@/components/ui/typography";

export const NotFoundComponent = memo(() => {
	return (
		<div className="space-y-6 flex flex-col justify-center items-center h-screen px-4 text-center">
			<Typography.H1 className="block bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-6xl font-black tracking-tighter">
				404
			</Typography.H1>
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="text-lg md:text-xl text-gray-400 max-w-md mx-auto leading-relaxed"
			>
				The page you're looking for doesn't exist.
			</motion.p>
			<BackButton />
		</div>
	);
});

NotFoundComponent.displayName = "NotFoundComponent";
