import { os } from "@orpc/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { withRequire } from "@/orpc/middleware/middleware";
import { RoleSchema } from "@/orpc/models/role";

export const listRoles = os
	.use(withRequire({ role: "ADMIN" }))
	.output(ApiResponseSchema(z.array(RoleSchema)))
	.handler(async () => {
		const roles = await prisma.role.findMany();
		return { status: 200, message: "Roles fetched", data: roles };
	});
