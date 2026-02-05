import { motion } from "framer-motion";

export const LibraryProgress = () => (
	<div className="px-6 py-2">
		<div className="flex justify-between items-end mb-1.5">
			<span className="text-[10px] font-bold text-muted-foreground/50 uppercase">
				Finish Rate
			</span>
			<span className="text-[10px] font-bold text-primary">64%</span>
		</div>
		<div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
			<motion.div
				initial={{ width: 0 }}
				animate={{ width: "64%" }}
				className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
			/>
		</div>
	</div>
);
