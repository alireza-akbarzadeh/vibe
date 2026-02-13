import { os } from "@orpc/server";
import { CollectionRouter } from "../procedures/collection";
import { HealthRouter } from "../procedures/health";
import { MediaRouter } from "../procedures/media";

export const router = os.router({
	health: HealthRouter,
	media: MediaRouter,
	collections: CollectionRouter,
});
