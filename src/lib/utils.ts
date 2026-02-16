import type { Row } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import type { JSX } from "react";

import { createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";
import type { LiteralUnion } from "type-fest";

export type StringNumber = `${number}`;
export type StringBoolean = `${boolean}`;

export type ExtractUnionStrict<T, U extends T> = Extract<T, U>;
export type ExcludeUnionStrict<T, U extends T> = Exclude<T, U>;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createContextFactory<ContextData>(options?: {
	defaultValue?: ContextData | null;
	errorMessage?: string;
}) {
	const opts = {
		defaultValue: null,
		errorMessage: "useContext must be used within a Provider",
		...options,
	};

	const context = createContext<ContextData | null>(opts.defaultValue);

	function useContextFactory(): ContextData {
		const contextValue = useContext(context);
		if (contextValue === null) {
			throw new Error(opts.errorMessage);
		}
		return contextValue;
	}

	return [context.Provider, useContextFactory] as const;
}

export function objectKeysTyped<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

type TryCatchResult<E = Error, T = unknown> = [null, T] | [E, null];

export function tryCatchSync<E = Error, T = unknown>(
	fn: () => T,
): TryCatchResult<E, T> {
	try {
		const data = fn();
		return [null, data];
	} catch (error) {
		return [error as E, null];
	}
}

export async function tryCatchAsync<E = Error, T = unknown>(
	promise: Promise<T>,
): Promise<TryCatchResult<E, T>> {
	try {
		const data = await promise;
		return [null, data];
	} catch (error) {
		return [error as E, null];
	}
}

type ErrorUnion<T extends (new (...args: any[]) => any)[]> = T extends (new (
	...args: any[]
) => infer U)[]
	? U
	: never;

export function tryCatchErrorsSync<
	E extends (new (
		...args: any[]
	) => any)[],
	T,
>(fn: () => T, errorClasses?: E): TryCatchResult<ErrorUnion<E>, T> {
	try {
		const data = fn();
		return [null, data];
	} catch (error) {
		if (errorClasses?.some((e) => error instanceof e)) {
			return [error as ErrorUnion<E>, null];
		} else {
			throw error;
		}
	}
}

export async function tryCatchErrorsAsync<
	E extends (new (
		...args: any[]
	) => any)[],
	T,
>(
	promise: Promise<T>,
	errorClasses?: E,
): Promise<TryCatchResult<ErrorUnion<E>, T>> {
	try {
		const data = await promise;
		return [null, data];
	} catch (error) {
		if (errorClasses?.some((e) => error instanceof e)) {
			return [error as ErrorUnion<E>, null];
		} else {
			throw error;
		}
	}
}

type Meta = JSX.IntrinsicElements["meta"];

type ViewportWidthHeightValues =
	| StringNumber
	| "device-width"
	| "device-height";

interface Viewport {
	width?: ViewportWidthHeightValues;
	height?: ViewportWidthHeightValues;
	"initial-scale"?: StringNumber;
	"minimum-scale"?: StringNumber;
	"maximum-scale"?: StringNumber;
	"user-scalable"?: "yes" | "no" | "1" | "0";
	"viewport-fit"?: "auto" | "contain" | "cover";
	[key: string]: unknown;
}

interface ImageMetadata {
	width?: number;
	height?: number;
	url?: string;
	alt?: string;
	format?: LiteralUnion<"jpg" | "png" | "webp" | "gif", string>;
}

type OpenGraphType =
	| "website"
	| "article"
	| "book"
	| "profile"
	| "product"
	| "place"
	| "event";

type TwitterCard = "summary" | "summary_large_image";

interface Metadata {
	charSet?: LiteralUnion<"utf-8", string>;
	title?: string;
	description?: string;
	viewport?: Viewport;
	author?: string;
	robots?: string;
	keywords?: string;
	images?: ImageMetadata[];
	openGraph?: {
		url?: string;
		type?: LiteralUnion<OpenGraphType, string>;
		locale?: string;
	};
	twitter?: {
		site?: string;
		card?: LiteralUnion<TwitterCard, string>;
	};
}

export function createMetadata(metadata: Metadata): Meta[] {
	const meta: Meta[] = [];

	if (metadata.charSet) {
		meta.push({ charSet: metadata.charSet });
	}

	if (metadata.title) {
		meta.push({ title: metadata.title });
	}

	if (metadata.viewport) {
		const viewport = Object.entries(metadata.viewport)
			.map(([key, value]) => `${key}=${value}`)
			.join(", ");

		meta.push({ name: "viewport", content: viewport });
	}

	addMetaTag("name", "description", metadata.description);
	addMetaTag("name", "author", metadata.author);
	addMetaTag("name", "robots", metadata.robots);
	addMetaTag("name", "keywords", metadata.keywords);

	addMetaTag("property", "og:title", metadata.title);
	addMetaTag("property", "og:description", metadata.description);
	addMetaTag("property", "og:url", metadata?.openGraph?.url);
	addMetaTag("property", "og:type", metadata?.openGraph?.type);
	addMetaTag("property", "og:locale", metadata?.openGraph?.locale);

	addMetaTag("name", "twitter:card", metadata?.twitter?.card);
	addMetaTag("name", "twitter:site", metadata?.twitter?.site);
	addMetaTag("name", "twitter:title", metadata.title);
	addMetaTag("name", "twitter:description", metadata.description);

	addMetaTag("name", "twitter:image", metadata.images?.[0]?.url);
	addMetaTag("name", "twitter:image:alt", metadata.images?.[0]?.alt);
	addMetaTag(
		"name",
		"twitter:image:width",
		metadata.images?.[0]?.width?.toString(),
	);
	addMetaTag(
		"name",
		"twitter:image:height",
		metadata.images?.[0]?.height?.toString(),
	);

	for (const image of metadata?.images || []) {
		addMetaTag("property", "og:image", image.url);
		addMetaTag("property", "og:image:alt", image.alt);
		addMetaTag("property", "og:image:type", image.format);
		addMetaTag("property", "og:image:width", image.width?.toString());
		addMetaTag("property", "og:image:height", image.height?.toString());
	}

	function addMetaTag(
		keyType: "name" | "property",
		keyName: string,
		content?: string,
	) {
		if (typeof content === "string" && content?.trim() !== "") {
			meta.push({ [keyType]: keyName, content });
		}
	}

	return meta;
}

export function generateSlug(slug: string) {
	const split = slug.split(" ");
	return split.join("-");
}

export function toCamelCase(value: string) {
	return value
		.replace(/[^a-z ]/gi, "")
		.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match: any, index: number) => {
			return +match === 0
				? ""
				: match[index === 0 ? "toLowerCase" : "toUpperCase"]();
		});
}

export const generateIdFromObject = (obj: any) => {
	// 1. Extract values and flatten any arrays (like your coordinates)
	// 2. Filter out non-primitive values or stringify them
	// 3. Join them with a delimiter to create a "seed" string
	const seed = Object.values(obj)
		.map((value) => (Array.isArray(value) ? value.join("-") : String(value)))
		.join("|");

	// 4. Create a simple hash (djb2 algorithm) to keep the ID clean and short
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		const char = seed.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}

	return `id_${Math.abs(hash).toString(36)}`;
};

export function downloadCSV<TData>(
	rows: Row<TData>[],
	filename: string,
): boolean {
	try {
		const data = rows.map((row) => row.original);
		if (data.length === 0) return false;

		const headers = Object.keys(data[0] as object).join(",");
		const csvRows = data.map((item) =>
			Object.values(item as object)
				.map((val) => {
					const stringVal =
						val === null || val === undefined ? "" : String(val);
					return `"${stringVal.replace(/"/g, '""')}"`;
				})
				.join(","),
		);

		const csvContent = [headers, ...csvRows].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `${filename}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		return true; // Success
	} catch (error) {
		console.error("CSV Export failed", error);
		return false;
	}
}

// Helper functions
export const formatDuration = (seconds: number): string => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hrs > 0) {
		return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatViews = (views: number): string => {
	if (views >= 1000000) {
		return `${(views / 1000000).toFixed(1)}M views`;
	}
	if (views >= 1000) {
		return `${(views / 1000).toFixed(1)}K views`;
	}
	return `${views} views`;
};

export const formatPayerTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getEmailProviderLink = (email: string, isSpam: boolean) => {
	const domain = email.split("@")[1]?.toLowerCase();

	if (domain === "gmail.com") {
		return isSpam
			? "https://mail.google.com/mail/u/0/#spam"
			: "https://mail.google.com/mail/u/0/#inbox";
	}

	if (
		domain === "outlook.com" ||
		domain === "hotmail.com" ||
		domain === "live.com"
	) {
		return isSpam
			? "https://outlook.live.com/mail/0/junkemail"
			: "https://outlook.live.com/mail/0/inbox";
	}

	if (domain === "yahoo.com") {
		return isSpam
			? "https://mail.yahoo.com/d/folders/2"
			: "https://mail.yahoo.com";
	}

	// Default fallback if unknown
	return "https://mail.google.com";
};

export const getCurrentUrl = () => {
	if (typeof window === "undefined") return "";
	return window.location.href;
};
