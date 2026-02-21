import { z } from "zod";
import { db } from "@/lib/db.server";
import { roleProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { RoleSchema } from "@/orpc/models/role";

export const listRoles = roleProcedure
	.output(ApiResponseSchema(z.array(RoleSchema)))
	.handler(async () => {
		const roles = await db.client.role.findMany();
		return { status: 200, message: "Roles fetched", data: roles };
	});
