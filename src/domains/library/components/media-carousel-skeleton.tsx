import { MediaCardSkeleton } from "./media-card-skeleton";
import { MediaCarousel } from "./media-carousel";

export function MediaCarouselSkeleton() {
	return (
		<MediaCarousel>
			{Array.from({ length: 5 }).map((_, i) => (
				<MediaCardSkeleton key={i} />
			))}
		</MediaCarousel>
	);
}
