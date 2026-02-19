import type { ColumnFiltersState } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	Database,
	RotateCcw,
	Zap,
} from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface UserDateFilterProps {
	onApply: (filters: ColumnFiltersState) => void;
	currentFilters: ColumnFiltersState;
}

export function UserDateFilter({
	onApply,
	currentFilters,
}: UserDateFilterProps) {
	// Local state for the date picker before "Applying"
	const [date, setDate] = React.useState<DateRange | undefined>(() => {
		const filter = currentFilters.find((f) => f.id === "joinedAt");
		return filter ? (filter.value as DateRange) : undefined;
	});

	const applyQuickFilter = (id: string, value: any) => {
		onApply([...currentFilters.filter((f) => f.id !== id), { id, value }]);
	};

	const handleFinalApply = () => {
		const newFilters = [...currentFilters.filter((f) => f.id !== "joinedAt")];
		if (date?.from) {
			newFilters.push({ id: "joinedAt", value: date });
		}
		onApply(newFilters);
	};

	return (
		<div className="space-y-8 py-6">
			{/* 1. Date Range Picker Section */}
			<div className="space-y-3">
				<h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
					<CalendarIcon className="h-3.5 w-3.5" /> Registration Period
				</h4>
				<div className="grid gap-2">
					<Popover>
						<PopoverTrigger asChild>
							{/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
							<Button
								id="date"
								variant={"outline"}
								className={cn(
									"h-12 w-full justify-start text-left font-bold rounded-xl border-border/40 bg-muted/20",
									!date && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
								{date?.from ? (
									date.to ? (
										<>
											{format(date.from, "LLL dd, y")} -{" "}
											{format(date.to, "LLL dd, y")}
										</>
									) : (
										format(date.from, "LLL dd, y")
									)
								) : (
									<span>Pick a date range</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto p-0 rounded-2xl shadow-2xl border-border/40"
							align="start"
						>
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={date?.from}
								selected={date}
								onSelect={setDate}
								numberOfMonths={2}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{/* 2. Usage & Stats */}
			<div className="space-y-3">
				<h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
					<Zap className="h-3.5 w-3.5" /> Resource Usage
				</h4>
				<div className="grid grid-cols-1 gap-2">
					<Button
						variant="outline"
						className="h-12 rounded-xl justify-between px-4 text-xs font-bold uppercase border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
						onClick={() => applyQuickFilter("usage", "high")}
					>
						<span>Heavy Resource Users (&gt;2GB)</span>
						<Database className="h-4 w-4 opacity-40" />
					</Button>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="pt-6 border-t border-border/40 flex flex-col gap-2">
				<Button
					onClick={handleFinalApply}
					className="w-full h-12 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-primary/20"
				>
					Apply All Filters
				</Button>
				<Button
					variant="ghost"
					onClick={() => {
						setDate(undefined);
						onApply([]);
					}}
					className="h-10 rounded-xl font-bold uppercase text-[10px] text-muted-foreground"
				>
					<RotateCcw className="mr-2 h-3 w-3" /> Clear Everything
				</Button>
			</div>
		</div>
	);
}
