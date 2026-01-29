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
	} = props;
	const { isMobile } = useMediaQuery();
	if (component === "sheet") {
		return (
			<Sheet open={open} onOpenChange={onOpenChange}>
				{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
				<SheetContent side="bottom" className="rounded-t-xl">
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
				<DrawerContent side="bottom" className="rounded-t-xl">
					<DrawerHeader>
						{title && <DrawerTitle>{title}</DrawerTitle>}
						{description && (
							<DrawerDescription>{description}</DrawerDescription>
						)}
					</DrawerHeader>
					<div className="mt-4">{children}</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					{title && <DialogTitle>{title}</DialogTitle>}
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<div className="py-4">{children}</div>
			</DialogContent>
		</Dialog>
	);
}
