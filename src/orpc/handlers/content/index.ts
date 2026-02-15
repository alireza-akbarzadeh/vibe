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

export const ContentRouter = base.router({
	latestReleases: getLatestReleases,
	popularSeries: getPopularSeries,
	animations: getAnimations,
	tvSeries: getTVSeries,
	horror: getHorrorMovies,
	comedy: getComedyMovies,
	romance: getRomanceMovies,
	topIMDB: getTopIMDB,
});
