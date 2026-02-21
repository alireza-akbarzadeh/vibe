import type { ValidLink } from "@/components/ui/link";
import { orpc } from "@/orpc/client";
import {
	Film,
	Headphones,
	Tv,
	Video,
	Volume2,
	type LucideIcon,
} from "lucide-react";


/** Trending content - movies/shows that are hot right now */
export function trendingQueryOptions(limit = 10, enabled = true) {
	return orpc.recommendations.trending.queryOptions({
		input: { limit, days: 7, page: 1 },
		enabled,
	});
}

/** Top rated content of all time */
export function topRatedQueryOptions(limit = 10, enabled = true) {
	return orpc.recommendations.topRated.queryOptions({
		input: { limit, page: 1 },
		enabled,
	});
}

/** Latest releases */
export function latestReleasesQueryOptions(limit = 10, enabled = true) {
	return orpc.content.latestReleases.queryOptions({
		input: { limit, page: 1 },
		enabled,
	});
}

/** Top IMDB rated */
export function topIMDBQueryOptions(limit = 10, enabled = true) {
	return orpc.content.topIMDB.queryOptions({
		input: { limit, page: 1 },
		enabled,
	});
}

/** Horror content */
export function horrorQueryOptions(limit = 10, enabled = true) {
	return orpc.content.horror.queryOptions({
		input: { limit, page: 1 },
		enabled,
	});
}

/** Comedy content */
export function comedyQueryOptions(limit = 10, enabled = true) {
	return orpc.content.comedy.queryOptions({
		input: { limit, page: 1 },
		enabled,
	});
}

/** All published media for stats */
export function allMediaStatsQueryOptions() {
	return orpc.media.list.queryOptions({
		input: { status: ["PUBLISHED"], page: 1, limit: 1 },
	});
}

/** Movie-specific stats */
export function movieStatsQueryOptions() {
	return orpc.media.list.queryOptions({
		input: { status: ["PUBLISHED"], type: "MOVIE", page: 1, limit: 1 },
	});
}

/** Track (song) specific stats */
export function trackStatsQueryOptions() {
	return orpc.media.list.queryOptions({
		input: { status: ["PUBLISHED"], type: "TRACK", page: 1, limit: 1 },
	});
}

/** Platform stats (users, movies, tracks) - public endpoint */
export function platformStatsQueryOptions(enabled = true) {
	return orpc.health.platformStats.queryOptions({
		enabled,
	});
}

/** Genre list */
export function genreListQueryOptions() {
	return orpc.genres.list.queryOptions({
		input: {},
	});
}

type HeroSectionLink = {
	icon: LucideIcon;
	link: ValidLink;
	color: string;
	label: string;
};

export const HERO_SECTION_LINK: HeroSectionLink[] = [
	{
		icon: Headphones,
		label: "Music",
		color: "from-blue-500 to-cyan-500",
		link: "/music",
	},
	{
		icon: Film,
		label: "Cinema",
		color: "from-purple-500 to-pink-500",
		link: "/movies",
	},
	{
		icon: Tv,
		label: "Series",
		color: "from-emerald-500 to-teal-500",
		link: "/movies",
	},
	{
		icon: Volume2,
		label: "Podcasts",
		color: "from-pink-500 to-rose-500",
		link: "/music",
	},
	{
		icon: Video,
		label: "Reels",
		color: "from-fuchsia-500 to-pink-500",
		link: "/reels",
	},
];
