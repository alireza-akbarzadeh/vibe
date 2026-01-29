import { LucideChevronRight, LucideEllipsis } from "lucide-react";
import type { ComponentProps } from "react";
import type { AsChildProps } from "@/components/ui/slot";
import { Slot } from "@/components/ui/slot";
import { cn } from "@/lib/utils";

function Breadcrumb(props: ComponentProps<"nav">) {
	return (
		<nav aria-label="breadcrumb" {...props}>
			{props.children}
		</nav>
	);
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
	return (
		<ol
			className={cn(
				"flex flex-wrap items-center gap-1.5 wrap-break-word text-sm text-muted-foreground sm:gap-2.5",
				className,
			)}
			{...props}
		/>
	);
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
	return (
		<li
			className={cn("inline-flex items-center gap-1.5", className)}
			{...props}
		/>
	);
}

function BreadcrumbLink({
	asChild,
	className,
	...props
}: ComponentProps<"a"> & AsChildProps) {
	const Comp = asChild ? Slot : "a";

	return <Comp className={cn("hover:text-foreground", className)} {...props} />;
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"a">) {
	return (
		<a
			aria-disabled="true"
			aria-current="page"
			className={cn("font-normal text-foreground", className)}
			{...props}
		/>
	);
}

function BreadcrumbSeparator({
	children,
	className,
	...props
}: ComponentProps<"li">) {
	return (
		<li
			role="presentation"
			aria-hidden="true"
			className={cn("[&>svg]:size-3.5", className)}
			{...props}
		>
			{children ?? <LucideChevronRight />}
		</li>
	);
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			role="presentation"
			aria-hidden="true"
			className={cn("flex size-9 items-center justify-center", className)}
			{...props}
		>
			<LucideEllipsis className="size-4" />
			<span className="sr-only">More</span>
		</span>
	);
}

export {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
};
