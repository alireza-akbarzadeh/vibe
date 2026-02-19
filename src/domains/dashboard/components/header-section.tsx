import { Download, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardFilters } from "./dashboard-filters";

export function HeaderSection() {
	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<div className="flex items-center gap-3">
					<h1 className="text-3xl font-bold tracking-tight">Overview</h1>
					<Badge
						variant="secondary"
						className="rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none px-3"
					>
						<div className="mr-1.5 size-1.5 rounded-full bg-emerald-500 animate-pulse" />
						Live
					</Badge>
				</div>
				<p className="text-muted-foreground text-sm mt-1">
					Real-time insights for your media platform as of{" "}
					{new Date().toLocaleDateString()}.
				</p>
			</div>
			<div className="flex items-center gap-3 overflow-x-auto">
				<DashboardFilters />
				<Button
					variant="outline"
					className="rounded-2xl border-border/60 bg-background/50 backdrop-blur-sm h-11 px-5"
				>
					<Download className="mr-2 size-4" />
					Schedule Export
				</Button>
				<Button className="rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all h-11 px-5">
					<PlusCircle className="mr-2 size-4" />
					New Analysis
				</Button>
			</div>
		</div>
	);
}
