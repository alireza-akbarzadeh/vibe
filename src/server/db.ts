import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "@prisma/client";
import { env } from "@/env";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const prismaWithQueryLogging = new PrismaClient({
	adapter,
	log: [
		{ emit: "stdout", level: "error" },
		{ emit: "stdout", level: "warn" },
	],
}).$extends({
	query: {
		$allModels: {
			async $allOperations({ model, operation, args, query }) {
				const start = Date.now();
				const result = await query(args);
				const duration = Date.now() - start;
				if (duration > 1000) {
					console.warn(
						`🐌 Slow query: ${model}.${operation} (${duration.toFixed(2)}ms)`,
					);
				}
				return result;
			},
		},
	},
});

declare global {
	var __prisma: PrismaClient | undefined;
}

const prisma = (globalThis.__prisma ||
	prismaWithQueryLogging) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") {
	globalThis.__prisma = prisma;
}

export class DatabaseClient {
	private readonly prisma: PrismaClient;

	constructor(prismaInstance: PrismaClient) {
		this.prisma = prismaInstance;
	}

	async transaction<T>(
		fn: (tx: Prisma.TransactionClient) => Promise<T>,
		options: {
			maxWait?: number;
			timeout?: number;
			isolationLevel?: Prisma.TransactionIsolationLevel;
		} = {},
	): Promise<T> {
		return this.prisma.$transaction(fn, options);
	}

	async healthCheck(): Promise<{
		status: "healthy" | "unhealthy";
		latency: number;
	}> {
		const start = Date.now();
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			const end = Date.now();
			return { status: "healthy", latency: end - start };
		} catch (_error) {
			const end = Date.now();
			return { status: "unhealthy", latency: end - start };
		}
	}

	async getConnectionStats(): Promise<{
		total_connections: number;
		active_connections: number;
		idle_connections: number;
	} | null> {
		try {
			const stats = await this.prisma.$queryRaw<
				[
					{
						total_connections: bigint;
						active_connections: bigint;
						idle_connections: bigint;
					},
				]
			>`
                SELECT
                  (SELECT count(*) FROM pg_stat_activity) as total_connections,
                  (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
                  (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle') as idle_connections
            `;
			return stats[0]
				? {
						total_connections: Number(stats[0].total_connections),
						active_connections: Number(stats[0].active_connections),
						idle_connections: Number(stats[0].idle_connections),
					}
				: null;
		} catch (error) {
			console.error("Failed to get connection stats:", error);
			return null;
		}
	}

	get client() {
		return this.prisma;
	}
}

export const db = new DatabaseClient(prisma);
