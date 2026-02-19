import { Search as SearchIcon } from "lucide-react";
import type * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTableContext } from "./table-context";

// --- Types ---
export interface StatusOption {
	label: string;
	value?: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}

// --- Components ---

export const TableSearch = ({
	columnId,
	placeholder,
	className,
}: {
	columnId?: string;
	placeholder: string;
	className?: string;
}) => {
	const { table } = useTableContext();
	const value = columnId
		? (table.getColumn(columnId)?.getFilterValue() as string)
		: (table.getState().globalFilter as string);

	const onChange = (val: string) => {
		if (columnId) {
			table.getColumn(columnId)?.setFilterValue(val);
		} else {
			table.setGlobalFilter(val);
		}
	};

	return (
		<div className={cn("relative w-full max-w-md", className)}>
			<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
			<Input
				placeholder={placeholder}
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className="pl-9 bg-card/40 border-border/40 rounded-2xl h-11"
			/>
		</div>
	);
};
