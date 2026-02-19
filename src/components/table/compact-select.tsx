import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import React from "react";
import { motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CompactSelectProps<TOption> {
	props: {
		options?: TOption[];
		getOptionValue?: (opt: TOption) => string;
		getOptionLabel?: (opt: TOption) => string;
		renderOption?: (opt: TOption) => React.ReactNode;
	};
	field: {
		state: { value: string };
		handleChange: (val: string) => void;
	};
	baseStyles: string;
	placeholder?: string;
	Icon?: LucideIcon;
	label?: string;
}

export function CompactSelect<TOption>({
	props,
	field,
	baseStyles,
	placeholder,
	Icon,
	label,
}: CompactSelectProps<TOption>) {
	const [open, setOpen] = React.useState(false);

	const getValue = props.getOptionValue || ((opt: TOption) => String(opt));
	const getLabel = props.getOptionLabel || ((opt: TOption) => String(opt));
	const renderOptionContent = props.renderOption || getLabel;

	const currentValue = (field.state.value as string) ?? "";
	const activeOption = props.options?.find(
		(opt: TOption) => getValue(opt) === currentValue,
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className={cn(
						baseStyles,
						"h-11 w-full justify-between px-4 transition-all",
						currentValue ? "text-white border-white/20" : "text-slate-500",
					)}
				>
					<div className="flex items-center gap-2 truncate">
						{Icon && <Icon className="size-4 shrink-0 text-slate-400" />}
						<span className="truncate">
							{activeOption ? renderOptionContent(activeOption) : placeholder}
						</span>
					</div>
					<ChevronDown
						className={cn(
							"ml-2 size-4 shrink-0 transition-transform duration-200 opacity-50",
							open && "rotate-180",
						)}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={6}
				// FIX: Force the content to be exactly the same width as the trigger (the Button)
				// We use min-w to ensure it doesn't shrink, and w-full within the trigger context
				className="p-0 bg-[#0d1117] border-white/10 shadow-2xl rounded-xl overflow-hidden w-[--radix-popover-trigger-width] min-w-[--radix-popover-trigger-width]"
			>
				<Command className="bg-transparent font-sans w-full border-none">
					<div className="flex items-center border-b border-white/5 px-2">
						{/* Custom Search Icon to match your reference */}
						<CommandInput
							placeholder={`Search ${label || ""}...`}
							className="h-11 text-sm text-white border-none focus:ring-0 bg-transparent w-full"
						/>
					</div>
					<CommandList className="max-h-[300px] overflow-y-auto scrollbar-none">
						<CommandEmpty className="py-8 text-xs text-center text-slate-500 uppercase tracking-widest font-bold">
							No matching records
						</CommandEmpty>
						<CommandGroup className="p-0">
							{props.options?.map((opt: TOption) => {
								const optValue = getValue(opt);
								const isSelected = currentValue === optValue;

								return (
									<CommandItem
										key={optValue}
										value={getLabel(opt)}
										onSelect={() => {
											field.handleChange(optValue);
											setOpen(false);
										}}
										className={cn(
											"flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all border-b border-white/[0.02] last:border-none",
											"aria-selected:bg-white/5 aria-selected:text-white",
											isSelected
												? "text-blue-400 bg-blue-400/5"
												: "text-slate-400",
										)}
									>
										<div className="flex-1 truncate text-sm font-medium">
											{renderOptionContent(opt)}
										</div>
										{isSelected && (
											<motion.div
												initial={{ scale: 0.5, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
											>
												<Check className="size-4 text-blue-400 stroke-[3]" />
											</motion.div>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
