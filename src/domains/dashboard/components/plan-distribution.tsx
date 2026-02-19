export function PlanDistribution() {
	const plans = [
		{ name: "Premium", share: 65, color: "bg-primary" },
		{ name: "Standard", share: 25, color: "bg-emerald-500" },
		{ name: "Free", share: 10, color: "bg-orange-500" },
	];

	return (
		<div className="rounded-3xl border border-border/40 bg-card/30 p-6 backdrop-blur-xl">
			<h3 className="font-bold mb-4">Revenue by Plan</h3>
			<div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/30 mb-6">
				{plans.map((p) => (
					<div
						key={p.name}
						className={p.color}
						style={{ width: `${p.share}%` }}
					/>
				))}
			</div>
			<div className="grid grid-cols-3 gap-2">
				{plans.map((p) => (
					<div key={p.name}>
						<p className="text-[10px] text-muted-foreground font-bold uppercase">
							{p.name}
						</p>
						<p className="text-sm font-bold">{p.share}%</p>
					</div>
				))}
			</div>
		</div>
	);
}
