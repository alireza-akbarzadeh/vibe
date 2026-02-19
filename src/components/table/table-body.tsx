import { flexRender, type Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useTableContext } from "./table-context";

export function TableBody<TData>({
	columnsCount,
	onRowDoubleClick,
	onClick,
}: {
	columnsCount: number;
	onRowDoubleClick?: (row: Row<TData>) => void;
	onClick?: (row: Row<TData>) => void;
}) {
	const { table } = useTableContext<TData>();
	const rows = table.getRowModel().rows;

	return (
		<div className="rounded-[2rem] border border-border/40 bg-card/20 backdrop-blur-2xl overflow-hidden overflow-x-auto">
			<table className="w-full text-sm min-w-[1000px]">
				<thead className="bg-muted/50 border-b border-border/40">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className={cn(
										"p-5 text-left font-black text-muted-foreground uppercase tracking-widest text-[10px]",
										header.column.id === "name" &&
											"sticky left-0 z-20 bg-muted/50",
									)}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="divide-y divide-border/10">
					{rows.length > 0 ? (
						rows.map((row) => (
							<tr
								key={row.id}
								className="hover:bg-primary/3 transition-colors cursor-pointer"
								onDoubleClick={() => onRowDoubleClick?.(row)}
								onClick={() => {
									onClick?.(row);
									row.toggleSelected(!row.getIsSelected());
								}}
							>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className={cn(
											"p-4",
											cell.column.id === "name" &&
												"sticky left-0 z-10 backdrop-blur-md border-r border-border/20",
										)}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={columnsCount}
								className="h-48 text-center text-muted-foreground italic"
							>
								No results found
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
