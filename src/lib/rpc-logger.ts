import pino from "pino";

/**
 * Pino logger for RPC/API requests
 * - In development: pipe through pino-pretty for readable logs
 * - In production: JSON format for structured logging
 */
export const rpcLogger = pino({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	formatters: {
		level: (label) => {
			return { level: label.toUpperCase() };
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	base:
		process.env.NODE_ENV === "production" ? undefined : { pid: process.pid },
});
