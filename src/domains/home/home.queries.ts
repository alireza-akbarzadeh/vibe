import { orpc } from "@/orpc/client";

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
		input: undefined,
		enabled,
	});
}

/** Genre list */
export function genreListQueryOptions() {
	return orpc.genres.list.queryOptions({
		input: {},
	});
}
