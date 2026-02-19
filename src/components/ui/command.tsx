import { useMediaQuery } from "@mantine/hooks";
import { Command as CommandPrimitive } from "cmdk";
import { LucideSearch } from "lucide-react";
import type { ComponentProps } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "./dialog";
import { Drawer, DrawerContent } from "./drawer";

function Command({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			className={cn(
				"flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
				className,
			)}
			{...props}
		/>
	);
}

interface CommandDialogProps
	extends React.ComponentPropsWithoutRef<typeof Dialog> {
	children: React.ReactNode;
}

// FIX: Ensure this is the ONLY declaration of CommandDialog in this file
export function CommandDialog({ children, ...props }: CommandDialogProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// We use a state to ensure we don't get hydration errors
	// between server-side and client-side rendering
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);

	const CommandContent = (
		<Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
			{children}
		</Command>
	);

	if (!mounted) return null;

	if (isDesktop) {
		return (
			<Dialog {...props}>
				<DialogContent className="overflow-hidden p-0 shadow-lg">
					{CommandContent}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer {...props}>
			<DrawerContent className="p-0">
				<div className="overflow-hidden rounded-t-[10px]">{CommandContent}</div>
			</DrawerContent>
		</Drawer>
	);
}

function CommandInput({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div className="flex items-center border-b px-3" cmdk-input-wrapper="">
			<LucideSearch className="mr-2 size-4 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				className={cn(
					"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

function CommandList({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			className={cn(
				"max-h-[300px] overflow-y-auto overflow-x-hidden",
				className,
			)}
			{...props}
		/>
	);
}

function CommandEmpty({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			className={cn("py-6 text-center text-sm", className)}
			{...props}
		/>
	);
}

function CommandGroup({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			className={cn(
				"overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function CommandSeparator({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			className={cn("-mx-1 h-px bg-border", className)}
			{...props}
		/>
	);
}

function CommandItem({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			className={cn(
				"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-selected:bg-accent aria-selected:text-accent-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function CommandShortcut({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"ml-auto text-xs tracking-widest text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
};
