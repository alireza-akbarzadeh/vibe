import { orpc } from "@/orpc/client";

/** Trending content - movies/shows that are hot right now */
export function trendingQueryOptions(limit = 10) {
	return orpc.recommendations.trending.queryOptions({
		input: { limit, days: 7, page: 1 },
	});
}

/** Top rated content of all time */
export function topRatedQueryOptions(limit = 10) {
	return orpc.recommendations.topRated.queryOptions({
		input: { limit, page: 1 },
	});
}

/** Latest releases */
export function latestReleasesQueryOptions(limit = 10) {
	return orpc.content.latestReleases.queryOptions({
		input: { limit, page: 1 },
	});
}

/** Top IMDB rated */
export function topIMDBQueryOptions(limit = 10) {
	return orpc.content.topIMDB.queryOptions({
		input: { limit, page: 1 },
	});
}

/** Horror content */
export function horrorQueryOptions(limit = 10) {
	return orpc.content.horror.queryOptions({
		input: { limit, page: 1 },
	});
}

/** Comedy content */
export function comedyQueryOptions(limit = 10) {
	return orpc.content.comedy.queryOptions({
		input: { limit, page: 1 },
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

/** Genre list */
export function genreListQueryOptions() {
	return orpc.genres.list.queryOptions({
		input: {},
	});
}
