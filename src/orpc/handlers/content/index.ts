import { os } from "@/orpc/root";
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

export const ContentRouter = os.router({
	latestReleases: getLatestReleases,
	popularSeries: getPopularSeries,
	animations: getAnimations,
	vSeries: getTVSeries,
	horror: getHorrorMovies,
	comedy: getComedyMovies,
	romance: getRomanceMovies,
	topIMDB: getTopIMDB,
	search: searchContent,
});
