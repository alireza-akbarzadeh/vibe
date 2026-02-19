import { Skeleton } from "../ui/skeleton";

export const TableLoading = ({
	columnsCount,
	rowsCount = 5,
}: {
	columnsCount: number;
	rowsCount?: number;
}) => {
	return (
		<div className="rounded-[2rem] border border-border/40 bg-card/20 backdrop-blur-2xl overflow-hidden shadow-2xl">
			<div className="w-full">
				{/* Skeleton Header */}
				<div className="flex bg-muted/50 border-b border-border/40 p-4">
					{Array.from({ length: columnsCount }).map((_, i) => (
						<div key={i + columnsCount} className="flex-1 px-2">
							<Skeleton className="h-3 w-20 bg-muted-foreground/20" />
						</div>
					))}
				</div>
				{/* Skeleton Body */}
				<div className="divide-y divide-border/20">
					{Array.from({ length: rowsCount }).map((_, rowIndex) => (
						<div key={rowIndex + rowsCount} className="flex p-4">
							{Array.from({ length: columnsCount }).map((_, colIndex) => (
								<div key={colIndex + columnsCount} className="flex-1 px-2">
									<Skeleton className="h-4 w-[80%] bg-muted/40" />
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
