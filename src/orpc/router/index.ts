import { CastRouter } from "../handlers/cast";
import { CollectionRouter } from "../handlers/collection";
import { ContentRouter } from "../handlers/content";
import { CreatorRouter } from "../handlers/creator";
import { FavoriteRouter } from "../handlers/favorite";
import { GenreRouter } from "../handlers/genre";
import { HealthRouter } from "../handlers/health";
import { LibraryRouter } from "../handlers/library";
import { MediaRouter } from "../handlers/media";
import { MediaAssetRouter } from "../handlers/media-asset";
import { PermissionRouter } from "../handlers/permission";
import { PersonRouter } from "../handlers/person";
import { PolarRouter } from "../handlers/polar";
import { PolarAdminRouter } from "../handlers/polar/admin";
import { ProfileRouter } from "../handlers/profile";
import { RecommendationRouter } from "../handlers/recommendation";
import { ReviewRouter } from "../handlers/review";
import { roleRouter } from "../handlers/role";
import { TestAuthRouter } from "../handlers/test-auth";
import { userRouter } from "../handlers/user";
import { ViewingHistoryRouter } from "../handlers/viewing-history";
import { WatchListRouter } from "../handlers/watchlist";
import { base } from "../context";

export const router = base.router({
	health: HealthRouter,
	media: MediaRouter,
	mediaAsset: MediaAssetRouter,
	cast: CastRouter,
	person: PersonRouter,
	collections: CollectionRouter,
	roles: roleRouter,
	users: userRouter,
	testAuth: TestAuthRouter,
	profiles: ProfileRouter,
	genres: GenreRouter,
	creators: CreatorRouter,
	permissions: PermissionRouter,
	favorites: FavoriteRouter,
	watchlist: WatchListRouter,
	viewingHistory: ViewingHistoryRouter,
	reviews: ReviewRouter,
	recommendations: RecommendationRouter,
	content: ContentRouter,
	polar: PolarRouter,
	polarAdmin: PolarAdminRouter,
	library: LibraryRouter,
});

export type AppRouter = typeof router;
