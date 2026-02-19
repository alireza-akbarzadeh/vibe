import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const deviceData = [
	{ name: "Desktop", value: 45, color: "#6366f1" },
	{ name: "Mobile", value: 40, color: "#10b981" },
	{ name: "Tablet", value: 15, color: "#f59e0b" },
];

export function DeviceInsights() {
	return (
		<div className="rounded-3xl border border-border/40 bg-card/30 p-6 backdrop-blur-xl h-full">
			<h3 className="font-bold mb-4">Device Usage</h3>
			<div className="h-[200px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={deviceData}
							innerRadius={60}
							outerRadius={80}
							paddingAngle={5}
							dataKey="value"
						>
							{deviceData.map((entry, index) => (
								<Cell
									key={`cell-${index}${entry.name}`}
									fill={entry.color}
									stroke="none"
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(0,0,0,0.8)",
								borderRadius: "12px",
								border: "none",
								color: "#fff",
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
			<div className="mt-4 space-y-2">
				{deviceData.map((item) => (
					<div
						key={item.name}
						className="flex items-center justify-between text-xs"
					>
						<div className="flex items-center gap-2">
							<div
								className="size-2 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-muted-foreground">{item.name}</span>
						</div>
						<span className="font-mono font-bold">{item.value}%</span>
					</div>
				))}
			</div>
		</div>
	);
}
