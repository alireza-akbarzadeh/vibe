import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

interface AppDialogProps {
	trigger?: React.ReactNode;
	children: React.ReactNode;
	title?: string;
	description?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	component: "sheet" | "drawer";
	className?: string
}

export function AppDialog(props: AppDialogProps) {
	const {
		trigger,
		children,
		title,
		description,
		open,
		onOpenChange,
		component,
		className
	} = props;
	const { isMobile } = useMediaQuery();

	if (component === "sheet") {
		return (
			<Sheet open={open} onOpenChange={onOpenChange}>
				{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
				<SheetContent side="bottom" className={cn("rounded-t-[20px] border-t border-white/10 bg-[#121212]", className)}>
					<SheetHeader>
						{title && <SheetTitle>{title}</SheetTitle>}
						{description && <SheetDescription>{description}</SheetDescription>}
					</SheetHeader>
					<div className="mt-4">{children}</div>
				</SheetContent>
			</Sheet>
		);
	}

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
				<DrawerContent className={cn("rounded-t-[20px] border-t border-white/10 bg-[#121212] focus:outline-none")}>
					{/* iPhone Styled Handle Bar */}
					<div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-white/20" />

					<DrawerHeader className="mt-2">
						{title && <DrawerTitle className="text-center text-lg font-semibold">{title}</DrawerTitle>}
						{description && (
							<DrawerDescription className="text-center">{description}</DrawerDescription>
						)}
					</DrawerHeader>
					<div className="mt-2 px-4 pb-8">{children}</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className={cn("sm:max-w-106.25 bg-[#1a1a1a] border-white/10 shadow-2xl")}>
				<DialogHeader>
					{title && <DialogTitle>{title}</DialogTitle>}
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<div className="py-4">{children}</div>
			</DialogContent>
		</Dialog>
	);
}