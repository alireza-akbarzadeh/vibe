import { z } from "zod";
import { publicProcedure } from "@/orpc/context";
import * as ResponseSchema from "@/orpc/helpers/response-schema";
import { PlatformStatsSchema } from "@/orpc/models/health";
import { db } from "@/server/db";
import { UserService } from "@/server/services/user.service";

// Health check schemas

const userService = new UserService();

export const HealthCheckSchema = z.object({
	status: z.enum(["healthy", "unhealthy"]),
	latency: z.number(),
	timestamp: z.string().datetime(),
});

// Basic health check procedure
export const healthCheck = publicProcedure
	.input(z.void())
	.output(ResponseSchema.ApiResponseSchema(HealthCheckSchema))
	.handler(async () => {
		const health = await db.healthCheck();
		return {
			status: 200,
			message: "Health check completed",
			data: {
				status: health.status,
				latency: health.latency,
				timestamp: new Date().toISOString(),
			},
		};
	});

// Database health check procedure
export const databaseHealth = publicProcedure
	.input(z.void())
	.output(
		ResponseSchema.ApiResponseSchema(
			z.object({
				status: z.enum(["healthy", "unhealthy"]),
				connectionStats: z
					.object({
						total_connections: z.number(),
						active_connections: z.number(),
						idle_connections: z.number(),
					})
					.nullable(),
				latency: z.number(),
			}),
		),
	)
	.handler(async () => {
		const health = await db.healthCheck();
		const connectionStats = await db.getConnectionStats();

		return {
			status: 200,
			message: "Database health check completed",
			data: {
				status: health.status,
				connectionStats,
				latency: health.latency,
			},
		};
	});

// Platform stats procedure
export const getPlatformStats = publicProcedure
	.input(z.void())
	.output(ResponseSchema.ApiResponseSchema(PlatformStatsSchema))
	.handler(async () => {
		const [userStats, totalMovies, totalTracks] = await Promise.all([
			userService.getUserStats(),
			db.client.media.count({ where: { type: "MOVIE" } }),
			db.client.media.count({ where: { type: "TRACK" } }),
		]);

		const totalMedia = totalMovies + totalTracks;

		return {
			status: 200,
			message: "Platform stats retrieved",
			data: {
				totalUsers: userStats.totalUsers,
				totalMovies,
				totalTracks,
				totalMedia,
			},
		};
	});

// Export all health procedures
export const healthProcedures = {
	healthCheck,
	databaseHealth,
	getPlatformStats,
};
