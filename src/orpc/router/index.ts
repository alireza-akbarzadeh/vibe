import { base } from "../errors/error";
import { CollectionRouter } from "../handlers/collection";
import { HealthRouter } from "../handlers/health";
import { MediaRouter } from "../handlers/media";
import { roleRouter } from "../handlers/role";
import { TestAuthRouter } from "../handlers/test-auth";

export const router = base.router({
	health: HealthRouter,
	media: MediaRouter,
	collections: CollectionRouter,
	roles: roleRouter,
	testAuth: TestAuthRouter,
});
