export interface FeaturedMovie {
	title: string;
	description: string;
	image: string;
	rating: number;
	year: number;
	genres: string[];
	runtime: string;
	movieId: number;
}

export interface MovieTypes {
	id: number;
	title: string;
	year: number;
	poster: string;
	backdrop: string;
	rating: number;
	votes: number;
	duration: string;
	releaseDate: string;
	rating_label: string;
	genres: string[];
	synopsis: string;
	director: string;
	writers: string[];
	stars: string[];
	productionCo: string;
	budget: string;
	revenue: string;
	trailerUrl: string;
	metascore: number;
	popularity: number;
	popularityChange: number;
}

export type ContinueWatching = {
	id: number;
	title: string;
	poster_path: string;
	rating: number;
	year: number;
	genres: string[];
	progress?: number;
	description?: string;
};

export interface ArtistType {
	id: number;
	name: string;
	type: "music" | "movie";
	image: string;
	genres: string[];
	followers: string;
	size: "small" | "medium" | "large";
	trending?: boolean;
	recommended?: boolean;
}
