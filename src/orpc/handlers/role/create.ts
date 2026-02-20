import { z } from "zod";
import { prisma } from "@/lib/db.server";
import { roleProcedure } from "@/orpc/context";
import { ApiResponseSchema } from "@/orpc/helpers/response-schema";
import { RoleSchema } from "@/orpc/models/role";
import { auditLog } from "../user/audit";

export const createRole = roleProcedure
	.input(
		z.object({
			name: z.string(),
			description: z.string().optional(),
		}),
	)
	.output(ApiResponseSchema(RoleSchema))
	.handler(async ({ input, context }) => {
		const role = await prisma.role.create({
			data: input,
		});

		await auditLog({
			userId: context.user.id,
			action: "CREATE_ROLE",
			resource: "Role",
			resourceId: role.id,
			metadata: input,
		});

		return { status: 200, message: "Role created", data: role };
	});
