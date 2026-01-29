import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export function WatchListButton() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.96 }}
			transition={{ type: "spring", stiffness: 400, damping: 15 }}
		>
			<Button
				size="lg"
				variant="outline"
				className="relative overflow-hidden bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-full px-8 group transition-colors duration-300"
			>
				<motion.div
					className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full"
					whileHover={{ x: "100%" }}
					transition={{ duration: 0.6, ease: "easeInOut" }}
				/>

				<motion.div className="flex items-center" initial={false}>
					<motion.div
						whileHover={{ rotate: 90 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<Plus className="w-5 h-5 mr-2" />
					</motion.div>
					<span className="font-medium tracking-wide">Watchlist</span>
				</motion.div>
			</Button>
		</motion.div>
	);
}
