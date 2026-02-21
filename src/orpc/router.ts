import { CastRouter } from "./handlers/cast";
import { CollectionRouter } from "./handlers/collection";
import { ContentRouter } from "./handlers/content";
import { CreatorRouter } from "./handlers/creator";
import { FavoriteRouter } from "./handlers/favorite";
import { GenreRouter } from "./handlers/genre";
import { HealthRouter } from "./handlers/health";
import { LibraryRouter } from "./handlers/library";
import { MediaRouter } from "./handlers/media";
import { MediaAssetRouter } from "./handlers/media-asset";
import { PermissionRouter } from "./handlers/permission";
import { PersonRouter } from "./handlers/person";
import { PolarRouter } from "./handlers/polar";
import { PolarAdminRouter } from "./handlers/polar/admin";
import { ProfileRouter } from "./handlers/profile";
import { RecommendationRouter } from "./handlers/recommendation";
import { ReviewRouter } from "./handlers/review";
import { roleRouter } from "./handlers/role";
import { RoomRouter } from "./handlers/streaming/room.handlers";
import { userRouter } from "./handlers/user";
import { ViewingHistoryRouter } from "./handlers/viewing-history";
import { WatchListRouter } from "./handlers/watchlist";
import { os } from "./root";

export const appRouter = os.router({
	cast: CastRouter,
	collections: CollectionRouter,
	content: ContentRouter,
	creator: CreatorRouter,
	favorites: FavoriteRouter,
	genres: GenreRouter,
	health: HealthRouter,
	library: LibraryRouter,
	media: MediaRouter,
	mediaAsset: MediaAssetRouter,
	permission: PermissionRouter,
	person: PersonRouter,
	polar: PolarRouter,
	polarAdmin: PolarAdminRouter,
	profile: ProfileRouter,
	recommendations: RecommendationRouter,
	reviews: ReviewRouter,
	role: roleRouter,
	room: RoomRouter,
	user: userRouter,
	viewingHistory: ViewingHistoryRouter,
	watchlist: WatchListRouter,
});

export type AppRouter = typeof appRouter;
