import { Skeleton } from "@/components/ui/skeleton";

export function MediaCardSkeleton() {
	return (
		<div className="w-48">
			<Skeleton className="h-64 w-full" />
			<Skeleton className="h-4 w-3/4 mt-2" />
		</div>
	);
}
