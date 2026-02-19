import pino from "pino";

/**
 * Application logger using Pino
 * Use this for general application logging
 */
const baseLogger = pino({
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

export const logger = {
	info: (...message: unknown[]) => baseLogger.info(message.join(" ")),
	warn: (...message: unknown[]) => baseLogger.warn(message.join(" ")),
	error: (...message: unknown[]) => baseLogger.error(message.join(" ")),
	success: (...message: unknown[]) =>
		baseLogger.info({ type: "success" }, message.join(" ")),
	loading: (...message: unknown[]) =>
		baseLogger.info({ type: "loading" }, message.join(" ")),
};
