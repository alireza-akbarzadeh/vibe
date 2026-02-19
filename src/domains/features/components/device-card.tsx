import React from "react";
import { motion } from "@/components/motion";

interface DeviceCardProps {
	icon: React.ReactElement;
	label: string;
}

export function DeviceCard({ icon, label }: DeviceCardProps) {
	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.02 }}
			className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center aspect-square hover:border-purple-500/50 transition-all"
		>
			<div className="text-purple-400 mb-3">
				{React.cloneElement(icon, {
					className: "w-10 h-10",
				} as React.HTMLAttributes<SVGElement>)}
			</div>
			<span className="text-sm font-medium">{label}</span>
		</motion.div>
	);
}
