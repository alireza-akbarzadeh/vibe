import type { MediaList } from "@/orpc/models/media.schema";

/**
 * Base Media type from Prisma/oRPC
 * Extends MediaList with additional UI-specific fields
 */

export interface FeaturedMovie extends Pick<MediaList, "id" | "title" | "description" | "rating" | "releaseYear" | "duration"> {
	image: string; // thumbnail
	genres: string[];
	runtime: string; // formatted duration
	movieId: number; // for legacy compatibility
}

export interface MovieTypes extends Pick<MediaList, "id" | "title" | "description" | "rating" | "releaseYear" | "duration" | "reviewCount" | "viewCount"> {
	year: number; // alias for releaseYear
	poster: string; // alias for thumbnail
	backdrop: string; // additional image
	votes: number; // alias for reviewCount
	releaseDate: string;
	rating_label: string;
	genres: string[];
	synopsis: string; // alias for description
	director: string;
	writers: string[];
	stars: string[];
	productionCo: string;
	budget: string;
	revenue: string;
	trailerUrl: string;
	metascore: number;
	popularity: number; // alias for viewCount
	popularityChange: number;
}

export interface ContinueWatching extends Pick<MediaList, "id" | "title" | "rating" | "releaseYear" | "description"> {
	poster_path: string; // alias for thumbnail
	year: number; // alias for releaseYear
	genres: string[];
	progress?: number;
}

export interface ArtistType {
	id: string;
	name: string;
	type: "music" | "movie";
	image: string;
	genres: string[];
	followers: string;
	size: "small" | "medium" | "large";
	trending?: boolean;
	recommended?: boolean;
}

export interface Reviews {
	id: string;
	username: string;
	avatar: string;
	rating: number;
	title: string;
	content: string;
	date: string;
	helpful: number;
	verified: boolean;
}
