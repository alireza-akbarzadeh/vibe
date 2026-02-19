import { AnimatePresence, motion } from "@/components/motion";

const activities = [
	{
		id: 1,
		user: "Alex Rivera",
		action: "Upgraded to",
		target: "Premium",
		time: "2m ago",
		icon: "🚀",
	},
	{
		id: 2,
		user: "Jordan Smith",
		action: "Verified email",
		target: "",
		time: "15m ago",
		icon: "✅",
	},
	{
		id: 3,
		user: "Casey Knight",
		action: "Logged in from",
		target: "Berlin, DE",
		time: "1h ago",
		icon: "🌐",
	},
];

export function ActivityFeed() {
	return (
		<div className="space-y-4">
			<h3 className="font-bold px-2 text-sm tracking-tight text-foreground/80">
				Live Activity
			</h3>
			<div className="space-y-3">
				<AnimatePresence mode="popLayout">
					{activities.map((item, index) => (
						<motion.div
							key={item.id}
							layout // Automatically animates position changes
							initial={{ opacity: 0, x: -20, scale: 0.95 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{
								delay: index * 0.1,
								type: "spring",
								stiffness: 260,
								damping: 20,
							}}
							whileHover={{ x: 5, backgroundColor: "rgba(var(--muted), 0.3)" }}
							className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 border border-border/10 cursor-pointer transition-colors"
						>
							{/* Icon Container with subtle pop motion */}
							<motion.div
								whileHover={{ rotate: [0, -10, 10, 0] }}
								className="size-10 shrink-0 rounded-xl bg-background flex items-center justify-center text-lg shadow-sm border border-border/50"
							>
								{item.icon}
							</motion.div>

							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold truncate">
									{item.user}
									<span className="text-muted-foreground font-normal ml-1">
										{item.action}
									</span>
									{item.target && (
										<span className="text-primary ml-1 font-medium">
											{item.target}
										</span>
									)}
								</p>
								<div className="flex items-center gap-2 mt-0.5">
									<span className="relative flex h-1.5 w-1.5">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
										<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
									</span>
									<p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
										{item.time}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
