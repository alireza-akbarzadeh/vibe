export interface Review {
	id: number;
	username: string;
	avatar: string;
	rating: number;
	title: string;
	content: string;
	date: string;
	helpful: number;
}

export interface StatsBarProps {
	rating: number;
	votes: number;
	metascore: number;
	popularity: number;
	popularityChange: number;
	revenue: string;
}

export interface MovieImage {
	url: string;
	type: "still" | "behind" | "poster" | "backdrop";
	description: string;
}

export interface ImageDetail {
	filePath: string;
	width: number;
	height: number;
	aspectRatio: number;
	voteAverage: number;
	voteCount: number;
}

export interface GroupedImages {
	backdrops: ImageDetail[];
	posters: ImageDetail[];
	stills: ImageDetail[];
	logos: ImageDetail[];
}
