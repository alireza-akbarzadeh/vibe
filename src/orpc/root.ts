import { os as createOS } from "@orpc/server";
import type { AppErrorMap, ORPCContext } from "./context";

export const os = createOS.$context<ORPCContext>().errors<AppErrorMap>();
