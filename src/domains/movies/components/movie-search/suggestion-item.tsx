import { Link } from "@tanstack/react-router";
import type { MediaList } from "@/orpc/models/media.schema";

export function SuggestionItemSkeleton() {
	return (
		<div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl">
			{/* Thumbnail skeleton */}
			<div className="w-12 h-18 shrink-0 rounded-lg bg-white/10 animate-pulse" />

			{/* Text content skeleton */}
			<div className="min-w-0 flex-1 space-y-2">
				{/* Title skeleton */}
				<div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
				{/* Year skeleton */}
				<div className="h-3 bg-white/10 rounded animate-pulse w-1/4" />
			</div>
		</div>
	);
}

export function SuggestionItem({ item }: { item: MediaList }) {
	return (
		<Link
			to="/movies/$movieId"
			params={{ movieId: item.id }}
			className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-left transition-colors group"
		>
			<div className="w-12 h-18 shrink-0 rounded-lg overflow-hidden bg-white/10">
				<img
					src={item.thumbnail}
					alt=""
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">
					{item.title}
				</p>
				<p className="text-xs text-gray-400">{item.releaseYear}</p>
			</div>
		</Link>
	);
}
