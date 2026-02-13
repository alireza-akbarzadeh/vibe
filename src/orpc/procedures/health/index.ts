import { os } from "@orpc/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

/* -------------------------------------------------------------------------- */
/*                              HEALTH CHECK SCHEMAS                           */
/* -------------------------------------------------------------------------- */

const HealthStatusSchema = z.object({
	status: z.enum(["healthy", "unhealthy", "degraded"]),
	timestamp: z.string(),
	uptime: z.number(),
	version: z.string().optional(),
});

const DatabaseHealthSchema = z.object({
	status: z.enum(["connected", "disconnected", "error"]),
	responseTime: z.number(),
	error: z.string().optional(),
});

const DetailedHealthSchema = z.object({
	status: z.enum(["healthy", "unhealthy", "degraded"]),
	timestamp: z.string(),
	uptime: z.number(),
	checks: z.object({
		database: DatabaseHealthSchema,
		memory: z.object({
			used: z.number(),
			total: z.number(),
			percentage: z.number(),
		}),
		system: z.object({
			platform: z.string(),
			nodeVersion: z.string(),
		}),
	}),
});

/* -------------------------------------------------------------------------- */
/*                              LIVENESS PROBE                                 */
/* -------------------------------------------------------------------------- */

/**
 * Liveness probe - indicates if the app is running
 * Returns 200 if the application is alive
 */
export const liveness = os
	.input(z.void())
	.output(HealthStatusSchema)
	.handler(async () => {
		return {
			status: "healthy" as const,
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			version: process.env.npm_package_version,
		};
	});

/* -------------------------------------------------------------------------- */
/*                             READINESS PROBE                                 */
/* -------------------------------------------------------------------------- */

/**
 * Readiness probe - indicates if the app is ready to serve traffic
 * Checks database connectivity
 */
export const readiness = os
	.input(z.void())
	.output(
		z.object({
			status: z.enum(["ready", "not_ready"]),
			timestamp: z.string(),
			checks: z.object({
				database: z.boolean(),
			}),
		}),
	)
	.handler(async () => {
		let isDatabaseReady = false;

		try {
			// Simple query to check DB connectivity
			await prisma.$queryRaw`SELECT 1`;
			isDatabaseReady = true;
		} catch (_error) {
			isDatabaseReady = false;
		}

		return {
			status: isDatabaseReady ? ("ready" as const) : ("not_ready" as const),
			timestamp: new Date().toISOString(),
			checks: {
				database: isDatabaseReady,
			},
		};
	});

/* -------------------------------------------------------------------------- */
/*                           DETAILED HEALTH CHECK                             */
/* -------------------------------------------------------------------------- */

/**
 * Detailed health check with database response time and system metrics
 */
export const health = os
	.input(z.void())
	.output(DetailedHealthSchema)
	.handler(async () => {
		const startTime = Date.now();
		let dbStatus: "connected" | "disconnected" | "error" = "disconnected";
		let dbResponseTime = 0;
		let dbError: string | undefined;

		try {
			// Check database connectivity with a simple query
			await prisma.$queryRaw`SELECT 1`;
			dbResponseTime = Date.now() - startTime;
			dbStatus = "connected";
		} catch (error) {
			dbResponseTime = Date.now() - startTime;
			dbStatus = "error";
			dbError = error instanceof Error ? error.message : "Unknown error";
		}

		// Get memory usage
		const memoryUsage = process.memoryUsage();
		const totalMemory = memoryUsage.heapTotal;
		const usedMemory = memoryUsage.heapUsed;
		const memoryPercentage = (usedMemory / totalMemory) * 100;

		// Determine overall health status
		let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy";
		if (dbStatus !== "connected") {
			overallStatus = "unhealthy";
		} else if (dbResponseTime > 1000) {
			// If DB response is slower than 1 second
			overallStatus = "degraded";
		}

		return {
			status: overallStatus,
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			checks: {
				database: {
					status: dbStatus,
					responseTime: dbResponseTime,
					error: dbError,
				},
				memory: {
					used: usedMemory,
					total: totalMemory,
					percentage: Math.round(memoryPercentage * 100) / 100,
				},
				system: {
					platform: process.platform,
					nodeVersion: process.version,
				},
			},
		};
	});

/* -------------------------------------------------------------------------- */
/*                           DATABASE METRICS                                  */
/* -------------------------------------------------------------------------- */

/**
 * Database-specific metrics and statistics
 */
export const databaseMetrics = os
	.input(z.void())
	.output(
		z.object({
			timestamp: z.string(),
			database: z.object({
				status: z.enum(["connected", "disconnected", "error"]),
				responseTime: z.number(),
				poolSize: z.number().optional(),
				activeConnections: z.number().optional(),
			}),
			queries: z.object({
				testQuery: z.object({
					success: z.boolean(),
					duration: z.number(),
				}),
			}),
		}),
	)
	.handler(async () => {
		const startTime = Date.now();
		let dbStatus: "connected" | "disconnected" | "error" = "disconnected";
		let testQuerySuccess = false;
		let testQueryDuration = 0;

		try {
			const queryStart = Date.now();
			await prisma.$queryRaw`SELECT 1 as test`;
			testQueryDuration = Date.now() - queryStart;
			testQuerySuccess = true;
			dbStatus = "connected";
		} catch (error) {
			testQueryDuration = Date.now() - startTime;
			dbStatus = "error";
		}

		const dbResponseTime = Date.now() - startTime;

		return {
			timestamp: new Date().toISOString(),
			database: {
				status: dbStatus,
				responseTime: dbResponseTime,
				poolSize: undefined, // Can be added if using connection pooling
				activeConnections: undefined, // Can be added with Prisma metrics
			},
			queries: {
				testQuery: {
					success: testQuerySuccess,
					duration: testQueryDuration,
				},
			},
		};
	});

/* -------------------------------------------------------------------------- */
/*                              EXPORT ROUTER                                  */
/* -------------------------------------------------------------------------- */

export const HealthRouter = os.router({
	liveness: liveness,
	readiness: readiness,
	health: health,
	database: databaseMetrics,
});
