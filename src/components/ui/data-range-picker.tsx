import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";


interface DateRangePickerProps extends Omit<React.ComponentPropsWithRef<typeof Button>, "value" | "onChange"> {
	date?: DateRange;
	onDateChange?: (date: DateRange | undefined) => void;
}

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
	({ className, date, onDateChange, ...props }, ref) => {

		const dateDisplay = React.useMemo(() => {
			if (!date?.from) return "Pick a date range";
			const from = format(date.from, "LLL dd, y");
			if (!date.to) return from;
			const to = format(date.to, "LLL dd, y");
			return `${from} - ${to}`;
		}, [date]);

		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						variant="outline"
						className={cn(
							"w-full justify-start gap-2 text-left font-normal h-11 rounded-xl",
							!date?.from && "text-muted-foreground",
							className
						)}
						{...props}
					>
						<CalendarRange className="size-4 text-primary" />
						<span>{dateDisplay}</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						// This calls actions.updateFilters directly
						onSelect={onDateChange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		);
	}
);

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };