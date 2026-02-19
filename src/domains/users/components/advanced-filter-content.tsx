import type { ColumnFiltersState } from "@tanstack/react-table";
import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	CreditCard,
	RotateCcw,
	UserPlus,
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

export function AdvancedFilterContent({
	onApply,
	currentFilters,
}: {
	onApply: (f: ColumnFiltersState) => void;
	currentFilters: ColumnFiltersState;
}) {
	// Independent states for two different date filters
	const [joinedDate, setJoinedDate] = React.useState<DateRange | undefined>(
		() => {
			const f = currentFilters.find((f) => f.id === "joinedAt");
			return f ? (f.value as DateRange) : undefined;
		},
	);

	const [expiryDate, setExpiryDate] = React.useState<DateRange | undefined>(
		() => {
			const f = currentFilters.find((f) => f.id === "subscriptionEnd");
			return f ? (f.value as DateRange) : undefined;
		},
	);

	const handleApply = () => {
		const filters: ColumnFiltersState = [
			...currentFilters.filter(
				(f) => f.id !== "joinedAt" && f.id !== "subscriptionEnd",
			),
		];

		if (joinedDate?.from) filters.push({ id: "joinedAt", value: joinedDate });
		if (expiryDate?.from)
			filters.push({ id: "subscriptionEnd", value: expiryDate });

		onApply(filters);
	};

	return (
		<div className="space-y-8 py-6">
			{/* JOINED AT FILTER */}
			<div className="space-y-3">
				<h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
					<UserPlus className="h-3.5 w-3.5 text-emerald-500" /> Registration
					Date
				</h4>
				<DatePickerWithRange
					date={joinedDate}
					setDate={setJoinedDate}
					placeholder="Filter by join date..."
				/>
			</div>

			{/* EXPIRY FILTER */}
			<div className="space-y-3">
				<h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
					<CreditCard className="h-3.5 w-3.5 text-primary" /> Subscription
					Expiry
				</h4>
				<DatePickerWithRange
					date={expiryDate}
					setDate={setExpiryDate}
					placeholder="Filter by expiry date..."
				/>
			</div>

			<div className="pt-6 border-t border-border/40 flex flex-col gap-2">
				<Button
					onClick={handleApply}
					className="w-full h-12 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
				>
					Sync Filter Set
				</Button>
				<Button
					variant="ghost"
					onClick={() => onApply([])}
					className="h-10 rounded-xl font-bold uppercase text-[10px] text-muted-foreground"
				>
					<RotateCcw className="mr-2 h-3 w-3" /> Reset Both
				</Button>
			</div>
		</div>
	);
}

// Helper component for reusability
function DatePickerWithRange({
	date,
	setDate,
	placeholder,
}: {
	date: DateRange | undefined;
	setDate: (d: DateRange | undefined) => void;
	placeholder: string;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"h-12 w-full justify-start text-left font-bold rounded-xl border-border/40 bg-muted/20",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
					{date?.from ? (
						date.to ? (
							<>
								{format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
							</>
						) : (
							format(date.from, "LLL dd, y")
						)
					) : (
						<span>{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto p-0 rounded-2xl border-border/40"
				align="start"
			>
				<Calendar
					mode="range"
					selected={date}
					onSelect={setDate}
					numberOfMonths={1}
				/>
			</PopoverContent>
		</Popover>
	);
}
