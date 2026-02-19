import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "@prisma/client";
import { env } from "@/env";

// Database adapter configuration
const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});

// Global prisma instance for development hot-reload protection
declare global {
	var __db: PrismaClient | undefined;
}

const createPrismaClient = () => {
	const prisma = new PrismaClient({
		adapter,
		log: [
			{ emit: "stdout", level: "error" },
			{ emit: "stdout", level: "warn" },
			{ emit: "stdout", level: "query" },
		],
	}).$extends({
		query: {
			$allModels: {
				async $allOperations({ model, operation, args, query }) {
					const start = Date.now();
					const result = await query(args);
					const end = Date.now();
					const duration = end - start;
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
	return prisma;
};

const prisma = globalThis.__db || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.__db = prisma;
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
			const latency = end - start;
			return { status: "healthy", latency };
		} catch (_error) {
			const end = Date.now();
			return { status: "unhealthy", latency: end - start };
		}
	}

	get client(): PrismaClient {
		return this.prisma;
	}
}

export const db = new DatabaseClient(prisma);
