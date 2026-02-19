import { useStore } from "@tanstack/react-store";
import {
	Calendar as CalendarIcon,
	Filter,
	Laptop,
	LayoutGrid,
	RotateCcw,
	ShieldCheck,
} from "lucide-react";
import { useCallback } from "react";
import type { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/data-range-picker";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { actions, dashboardStore } from "../store/dashboard.store";

export function DashboardFilters() {
	const filters = useStore(dashboardStore, (state) => state.filters);
	const handleDateChange = useCallback((range: DateRange | undefined) => {
		actions.updateFilters({
			dateRange: {
				from: range?.from,
				to: range?.to,
			},
		});
	}, []);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					className="relative rounded-2xl border-dashed bg-background/50 backdrop-blur-sm"
				>
					<Filter className="mr-2 size-4" />
					Global Filters
					<Badge className="ml-2 h-5 w-5 rounded-full bg-primary text-[10px]">
						{/* Calculate active filters dynamically */}
						{
							Object.values(filters).filter((v) => v !== "all" && v !== false)
								.length
						}
					</Badge>
				</Button>
			</SheetTrigger>

			<SheetContent className="w-full sm:max-w-md border-l border-border/40 bg-card/95 backdrop-blur-xl flex flex-col">
				<SheetHeader className="mt-6">
					<div className="flex items-center justify-between">
						<SheetTitle className="text-2xl font-bold text-primary">
							Filters
						</SheetTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => actions.resetFilters()}
							className="text-muted-foreground hover:text-destructive"
						>
							<RotateCcw className="mr-2 size-3" /> Reset
						</Button>
					</div>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto py-6 space-y-8 pr-2">
					{/* 1. DATE RANGE */}
					<div className="space-y-3">
						<Label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center">
							<CalendarIcon className="mr-2 size-3" /> Timeframe
						</Label>
						<DateRangePicker
							className="w-full"
							date={filters.dateRange}
							onDateChange={(range) => handleDateChange(range)}
						/>
					</div>

					{/* 2. VERIFICATION STATUS */}
					<div className="flex items-center justify-between p-4 rounded-3xl bg-primary/5 border border-primary/10">
						<div className="flex items-center gap-3">
							<ShieldCheck className="text-primary size-5" />
							<div className="space-y-0.5">
								<Label className="text-sm font-bold">Verified Audit</Label>
								<p className="text-[11px] text-muted-foreground">
									Only KYC cleared accounts
								</p>
							</div>
						</div>
						<Switch
							checked={filters.verifiedOnly}
							onCheckedChange={(v) =>
								actions.updateFilters({ verifiedOnly: v })
							}
						/>
					</div>

					{/* 3. DEVICE SEGMENT (Added functionality) */}
					<div className="space-y-3">
						<Label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center">
							<Laptop className="mr-2 size-3" /> Platform Access
						</Label>
						<div className="flex flex-wrap gap-2">
							{["Desktop", "Mobile", "Tablet"].map((device) => (
								<Button
									key={device}
									variant="outline"
									className="rounded-xl h-8 text-xs"
								>
									{device}
								</Button>
							))}
						</div>
					</div>

					{/* 4. CONTENT CATEGORY (Added functionality) */}
					<div className="space-y-3">
						<Label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center">
							<LayoutGrid className="mr-2 size-3" /> Content Focus
						</Label>
						<Select
							value={filters.region}
							onValueChange={(v) => actions.updateFilters({ region: v })}
						>
							<SelectTrigger className="rounded-xl">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Global (All Regions)</SelectItem>
								<SelectItem value="na">North America</SelectItem>
								<SelectItem value="eu">Europe</SelectItem>
								<SelectItem value="apac">Asia Pacific</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* 5. RISK PROFILE */}
					<div className="space-y-3">
						<Label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
							Security Risk Level
						</Label>
						<div className="grid grid-cols-2 gap-2">
							{["safe", "medium", "high"].map((level) => (
								<Button
									key={level}
									variant={
										filters.riskThreshold === level ? "default" : "outline"
									}
									onClick={() =>
										actions.updateFilters({ riskThreshold: level })
									}
									className="capitalize rounded-xl h-10"
								>
									{level} Risk
								</Button>
							))}
						</div>
					</div>
				</div>

				<SheetFooter className="mt-auto pt-6 border-t border-border/20">
					<Button className="w-full h-12 rounded-2xl bg-primary hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20">
						Apply System Filters
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
