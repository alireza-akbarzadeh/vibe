import { ChevronDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTableContext } from "./table-context";

// --- Types ---
export interface StatusOption {
	label: string;
	value?: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}

export const TableFilterTabs = ({
	columnId,
	options,
}: {
	columnId: string;
	options: string[];
}) => {
	const { table } = useTableContext();
	const column = table.getColumn(columnId);
	const currentValue = (column?.getFilterValue() as string) ?? "";
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"h-11 w-full md:w-44 justify-between rounded-2xl border-border/40 bg-card/40 px-4 text-[11px] font-black uppercase tracking-widest",
						currentValue && "border-primary/40 bg-primary/5 text-primary",
					)}
				>
					<span className="truncate">{currentValue || "All Categories"}</span>
					<ChevronDown
						className={cn(
							"size-4 opacity-50 transition-transform",
							open && "rotate-180",
						)}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[--radix-popover-trigger-width] p-1.5 bg-[#0d1117]/95 backdrop-blur-xl border-border/40 rounded-2xl"
			>
				{options.map((opt) => (
					<Button
						key={opt}
						variant="ghost"
						size="sm"
						onClick={() => {
							column?.setFilterValue(opt === "All" ? "" : opt);
							setOpen(false);
						}}
						className={cn(
							"w-full justify-start rounded-xl px-3 text-[10px] font-bold uppercase h-9",
							(opt === "All" ? currentValue === "" : currentValue === opt)
								? "bg-primary/10 text-primary"
								: "text-muted-foreground",
						)}
					>
						{opt}
					</Button>
				))}
			</PopoverContent>
		</Popover>
	);
};
