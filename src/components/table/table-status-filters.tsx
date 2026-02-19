import { Check, ChevronDown, Command, RotateCcw } from "lucide-react";
import React from "react";
import {
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useTableContext } from "./table-context";
import type { StatusFiltersProps } from "./table-types";

export const TableStatusFilters = ({
	columnId,
	options,
	title = "Status",
}: StatusFiltersProps) => {
	const { table } = useTableContext();
	const column = table.getColumn(columnId);
	const currentValue = (column?.getFilterValue() as string) ?? "";
	const [open, setOpen] = React.useState(false);

	const activeOption = options.find(
		(opt) => (opt.value ?? opt.label) === currentValue,
	);

	return (
		<div className="flex items-center gap-2 w-full md:w-auto">
			<span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-1">
				{title}:
			</span>

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							"h-10 w-full md:w-50 justify-between rounded-xl border-border/40 bg-[#0d1117] text-[11px] font-bold uppercase tracking-wider transition-all",
							currentValue
								? "text-primary border-primary/30"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<div className="flex items-center gap-2 truncate">
							{activeOption ? (
								<>
									<activeOption.icon
										className={cn("size-3.5", activeOption.color)}
									/>
									<span>{activeOption.label}</span>
								</>
							) : (
								<span>Select {title}</span>
							)}
						</div>
						<ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-50 p-0 bg-[#0d1117] border-border/40 shadow-2xl"
					align="start"
				>
					<Command className="bg-transparent">
						<CommandInput
							placeholder={`Filter ${title}...`}
							className="h-9 text-xs"
						/>
						<CommandList>
							<CommandEmpty className="py-2 text-[10px] text-center uppercase text-muted-foreground">
								No results
							</CommandEmpty>
							<CommandGroup>
								{options.map((s) => {
									const filterValue = s.value ?? s.label;
									const isActive = currentValue === filterValue;
									const Icon = s.icon;

									return (
										<CommandItem
											key={s.label}
											onSelect={() => {
												column?.setFilterValue(isActive ? "" : filterValue);
												setOpen(false);
											}}
											className="flex items-center gap-2 px-3 py-2 cursor-pointer text-[11px] font-bold uppercase"
										>
											<Icon className={cn("size-3.5", s.color)} />
											<span className="flex-1">{s.label}</span>
											{isActive && <Check className="size-3 text-primary" />}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
						{currentValue && (
							<div className="p-1 border-t border-border/10">
								<Button
									variant="ghost"
									onClick={() => {
										column?.setFilterValue("");
										setOpen(false);
									}}
									className="w-full h-8 text-[10px] font-bold uppercase text-destructive hover:text-destructive/80"
								>
									<RotateCcw className="mr-2 size-3" />
									Reset Filter
								</Button>
							</div>
						)}
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};
