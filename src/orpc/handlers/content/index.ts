import { base } from "@/orpc/router/base";
import {
	getAnimations,
	getComedyMovies,
	getHorrorMovies,
	getLatestReleases,
	getPopularSeries,
	getRomanceMovies,
	getTopIMDB,
	getTVSeries,
} from "./get";
import { searchContent } from "./search";

export const ContentRouter = base.router({
	latestReleases: getLatestReleases,
	popularSeries: getPopularSeries,
	animations: getAnimations,
	tvSeries: getTVSeries,
	horror: getHorrorMovies,
	comedy: getComedyMovies,
	romance: getRomanceMovies,
	topIMDB: getTopIMDB,
	search: searchContent,
});
