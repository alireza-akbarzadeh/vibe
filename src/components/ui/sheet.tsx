import * as SheetPrimitive from "@radix-ui/react-dialog";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { LucideX } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------
 * Root primitives
 * -------------------------------------------------------------------------- */

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

/* -----------------------------------------------------------------------------
 * Overlay (dark, cinematic, glassy)
 * -------------------------------------------------------------------------- */

function SheetOverlay({
	className,
	...props
}: ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			className={cn(
				`
        fixed inset-0 z-50
        bg-black/70 backdrop-blur-sm
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=open]:fade-in-0
        data-[state=closed]:fade-out-0
        `,
				className,
			)}
			{...props}
		/>
	);
}

/* -----------------------------------------------------------------------------
 * Sheet variants (panel)
 * -------------------------------------------------------------------------- */

const sheetVariants = cva(
	`
  fixed z-50
  flex flex-col
  gap-4
  bg-background/95
  backdrop-blur-xl
  p-6
  shadow-2xl
  transition-all ease-out
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=closed]:duration-300
  data-[state=open]:duration-500
  `,
	{
		variants: {
			side: {
				top: `
          inset-x-0 top-0 border-b
          data-[state=closed]:slide-out-to-top
          data-[state=open]:slide-in-from-top
        `,
				bottom: `
          inset-x-0 bottom-0 border-t
          data-[state=closed]:slide-out-to-bottom
          data-[state=open]:slide-in-from-bottom
        `,
				left: `
          inset-y-0 left-0 h-full w-[85%]
          border-r
          data-[state=closed]:slide-out-to-left
          data-[state=open]:slide-in-from-left
          sm:max-w-md
        `,
				right: `
          inset-y-0 right-0 h-full w-[85%]
          border-l
          data-[state=closed]:slide-out-to-right
          data-[state=open]:slide-in-from-right
          sm:max-w-md
        `,
			},
		},
		defaultVariants: {
			side: "right",
		},
	},
);

/* -----------------------------------------------------------------------------
 * Content
 * -------------------------------------------------------------------------- */

interface SheetContentProps
	extends ComponentProps<typeof SheetPrimitive.Content>,
		VariantProps<typeof sheetVariants> {
	noCLose?: boolean;
}

function SheetContent({
	side = "right",
	className,
	children,
	noCLose,
	...props
}: SheetContentProps) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				className={cn(sheetVariants({ side }), className)}
				{...props}
			>
				{children}
				{noCLose ? null : (
					<SheetPrimitive.Close
						className="
				absolute right-4 top-4
				rounded-full p-2
				bg-muted/40
				text-muted-foreground
				backdrop-blur
				transition-all
				hover:bg-muted
				hover:text-foreground
				focus:outline-none
				focus:ring-2 focus:ring-ring
				"
					>
						<LucideX className="h-4 w-4" />
						<span className="sr-only">Close</span>
					</SheetPrimitive.Close>
				)}
			</SheetPrimitive.Content>
		</SheetPortal>
	);
}

/* -----------------------------------------------------------------------------
 * Layout helpers
 * -------------------------------------------------------------------------- */

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-1 border-b pb-4", className)}
			{...props}
		/>
	);
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function SheetTitle({
	className,
	...props
}: ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			className={cn("text-lg font-semibold tracking-tight", className)}
			{...props}
		/>
	);
}

function SheetDescription({
	className,
	...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			className={cn("text-sm text-muted-foreground leading-relaxed", className)}
			{...props}
		/>
	);
}

/* -----------------------------------------------------------------------------
 * Exports
 * -------------------------------------------------------------------------- */

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
	SheetOverlay,
	SheetPortal,
};
