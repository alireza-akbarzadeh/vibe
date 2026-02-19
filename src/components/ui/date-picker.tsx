import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { format } from "date-fns";
import { LucideCalendar } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import type { PropsBase, PropsSingle } from "react-day-picker";
import type { Except, Simplify } from "type-fest";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar, type CalendarBaseProps } from "./calendar";

type CalendarProps = Simplify<
	Except<PropsBase & PropsSingle, "mode"> &
		CalendarBaseProps & {
			selected?: Date;
			onSelect?: (date: Date) => void;
			defaultSelected?: Date;
		}
>;

type DatePickerProps = ComponentPropsWithRef<typeof Button> & {
	calendar?: CalendarProps;
};

function DatePicker({ calendar, className, ...props }: DatePickerProps) {
	const [date, setDate] = useControllableState({
		prop: calendar?.selected,
		onChange: calendar?.onSelect,
		defaultProp: calendar?.defaultSelected ?? new Date(),
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start gap-2 text-left font-normal",
						!date && "text-muted-foreground",
						className,
					)}
					{...props}
				>
					<LucideCalendar className="size-4" />
					<span>{date ? format(date, "PPP") : "Pick a date"}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={(selected) => {
						if (selected) setDate(selected);
					}}
					autoFocus
					{...calendar}
				/>
			</PopoverContent>
		</Popover>
	);
}

export { DatePicker };
