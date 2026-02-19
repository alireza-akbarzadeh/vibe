import { Download, Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useTableContext } from "./table-context";
import type { BulkActionsProps } from "./table-types";

export function TableBulkActions<TData>({
	onDelete,
	onDownload,
	deleteTitle = "Are you sure?",
	deleteDescription = "This action cannot be undone. Selected records will be permanently removed.",
}: BulkActionsProps<TData>) {
	const { table } = useTableContext<TData>();
	const selectedRows = table.getFilteredSelectedRowModel().rows;

	if (selectedRows.length === 0) return null;

	return (
		<div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="destructive"
						size="sm"
						className="h-8 rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-destructive/20"
					>
						<Trash2 className="mr-1.5 size-3" />
						Delete ({selectedRows.length})
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl">
					<AlertDialogHeader>
						<AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
						<AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="rounded-xl border-none bg-white/5 hover:bg-white/10">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => onDelete?.(selectedRows)}
							className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Confirm Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Button
				variant="outline"
				size="sm"
				onClick={() => onDownload?.(selectedRows)}
				className="h-8 rounded-lg text-[10px] font-bold uppercase border-border/40 bg-card/50"
			>
				<Download className="mr-1.5 size-3" />
				Export CSV
			</Button>
		</div>
	);
}
