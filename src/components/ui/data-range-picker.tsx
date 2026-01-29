import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateRangePickerProps extends ComponentPropsWithRef<typeof Button> {
	date?: DateRange;
	onDateChange?: (date: DateRange | undefined) => void;
}

function DateRangePicker({
	className,
	date: externalDate,
	onDateChange,
	...props
}: DateRangePickerProps) {
	// Handle both controlled and uncontrolled states
	const [internalDate, setInternalDate] = useState<DateRange | undefined>();
	const date = externalDate ?? internalDate;
	const setDate = onDateChange ?? setInternalDate;

	function formatDate() {
		if (!date?.from) return "Pick a date";

		const from = format(date.from, "LLL dd, y");
		if (!date.to) return from;

		const to = format(date.to, "LLL dd, y");
		return `${from} - ${to}`;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start gap-2 text-left font-normal",
						!date?.from && "text-muted-foreground",
						className,
					)}
					{...props}
				>
					<CalendarRange className="size-4" />
					<span>{formatDate()}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
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
	);
}

export { DateRangePicker };
