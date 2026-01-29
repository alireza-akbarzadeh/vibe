import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { type AsChildProps, Slot } from "../ui/slot";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TooltipButtonProps
	extends ComponentProps<"button">,
		VariantProps<typeof buttonVariants>,
		AsChildProps {
	isActive?: boolean;
	tooltip?: string | ComponentProps<typeof TooltipContent>;
}

export function TooltipButton({
	asChild = false,
	isActive = false,
	variant = "default",
	size = "default",
	tooltip,
	className,
	...props
}: TooltipButtonProps) {
	const Comp = asChild ? Slot : "button";

	const button = (
		<Comp
			data-sidebar="menu-button"
			data-size={size}
			data-active={isActive}
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	);

	if (!tooltip) {
		return button;
	}

	if (typeof tooltip === "string") {
		tooltip = {
			children: tooltip,
		};
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent side="right" align="center" {...tooltip} />
		</Tooltip>
	);
}
