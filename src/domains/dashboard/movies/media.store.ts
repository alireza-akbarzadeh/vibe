import { Store } from "@tanstack/store";
import { client } from "@/orpc/client";
import type { MediaList } from "@/orpc/models/media.schema";

export interface MediaItem extends MediaList {
	status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "REJECTED";
}

export interface MediaFilters {
	type: string;
	status: string[];
	search: string;
	category: string;
}

export const mediaUIStore = new Store({
	media: [] as MediaItem[],
	isLoading: false,
	isBulkCreating: false,
	isUpdating: false,
	error: null as string | null,
	total: 0,
	currentPage: 1,
	totalPages: 1,
	filters: {
		type: "All",
		status: ["PUBLISHED"],
		search: "",
		category: "ALL",
	} as MediaFilters,
});

// Action: Fetch media list from API
export const fetchMediaAction = async (page = 1, limit = 50, search = "") => {
	mediaUIStore.setState((s) => ({ ...s, isLoading: true, error: null }));
	const state = mediaUIStore.state;
	try {
		const baseParams: {
			page: number;
			limit: number;
			status?: ("DRAFT" | "REVIEW" | "PUBLISHED" | "REJECTED")[];
			search?: string;
			type?: string;
		} = {
			page,
			limit,
			status: state.filters.status as any,
		};

		if (search?.trim()) {
			baseParams.search = search.trim();
		} else if (state.filters.search?.trim()) {
			baseParams.search = state.filters.search.trim();
		}

		// Handle Type Filter
		// Note: The API might expect 'type' in a specific way.
		// Looking at schema, it's MediaList input.
		// I'll assume the API can filter by type if I pass it, but `list` param in `get.ts` seemed to use `listMediaInputSchema`.
		// Let's assume for now we filter what we can.
		// If the API doesn't support type filtering, we might have to filter client side or update API.
		// But for now, let's just pass status which we know works (it was hardcoded).
		
		// The previous hardcoded status was all statuses. 
		// Now we use `state.filters.status`.
		// We need to ensure `state.filters.status` is populated correctly.
		
		const response = await client.media.list(baseParams);

		if (response.data) {
			mediaUIStore.setState((s) => ({
				...s,
				media: response.data.items as MediaItem[],
				total: response.data.pagination.total,
				currentPage: response.data.pagination.page,
				totalPages: response.data.pagination.totalPages,
				isLoading: false,
			}));
		}
	} catch (error) {
		mediaUIStore.setState((s) => ({
			...s,
			error: "Failed to fetch media",
			isLoading: false,
		}));
		console.error("Media fetch error:", error);
	}
};

export const setStatusFilter = (status: string[]) => {
	mediaUIStore.setState((s) => ({
		...s,
		filters: { ...s.filters, status },
	}));
	fetchMediaAction(1, 50, mediaUIStore.state.filters.search);
};

export const setSearchFilter = (search: string) => {
	mediaUIStore.setState((s) => ({
		...s,
		filters: { ...s.filters, search },
	}));
	// Debouncing should be handled in UI
};


// Action: Delete media
export const deleteMediaAction = async (id: string) => {
	try {
		await client.media.delete({ id });
		// Refresh the list
		await fetchMediaAction(mediaUIStore.state.currentPage);
		return true;
	} catch (error) {
		console.error("Delete media error:", error);
		return false;
	}
};

// Action: Bulk delete media
export const bulkDeleteMediaAction = async (ids: string[]) => {
	try {
		await Promise.all(ids.map((id) => client.media.delete({ id })));
		// Refresh the list
		await fetchMediaAction(mediaUIStore.state.currentPage);
		return true;
	} catch (error) {
		console.error("Bulk delete media error:", error);
		return false;
	}
};

// Action: Bulk create media
export const bulkCreateMediaAction = async (items: any[]) => {
	mediaUIStore.setState((s) => ({ ...s, isBulkCreating: true, error: null }));
	try {
		await client.media.bulkCreate(items);
		await fetchMediaAction(1); // Go to first page to see new items
		mediaUIStore.setState((s) => ({ ...s, isBulkCreating: false }));
		return true;
	} catch (error) {
		console.error("Bulk create media error:", error);
		mediaUIStore.setState((s) => ({
			...s,
			error: "Failed to bulk create media",
			isBulkCreating: false,
		}));
		return false;
	}
};

// Action: Update media status
export const updateMediaStatusAction = async (
	id: string,
	status: "DRAFT" | "REVIEW" | "PUBLISHED" | "REJECTED",
) => {
	mediaUIStore.setState((s) => ({ ...s, isUpdating: true }));
	try {
		// We need to fetch the item first to get other required fields if update endpoint requires full object
		// But usually update endpoints allow partial updates or we assume we have data.
		// Looking at update.ts, it requires createMediaInputSchema.extend({ id: z.string() })
		// which implies full object replacement or at least all required fields.
		// However, let's try to just send what we have if the schema allows partials (which zod schema might not).
		// Wait, the handler implementation:
		// const { id, genreIds, creatorIds, ...mediaData } = input;
		// const media = await tx.media.update({ ... data: { ...mediaData } ... })
		// If the input schema requires all fields, we are in trouble for partial updates.
		// Let's assume we can fetch -> update.

		const item = mediaUIStore.state.media.find((m) => m.id === id);
		if (!item) throw new Error("Item not found in store");

		// This is risky if we don't have all fields in the list view.
		// The list view `MediaListItemSchema` might have fewer fields than `createMediaInputSchema`.
		// Let's check `MediaListItemSchema`.
		// It usually has id, title, etc.
		// If we can't do partial update, we might need a specific `updateStatus` endpoint or `patch`.
		// For now, let's assume we can't easily do it without full data.
		// I'll skip implementing `updateMediaStatusAction` for now or implement it by fetching details first.

		// Alternative: Use a specific server action if available? No.
		// Let's just fetch details then update.
		const details = await client.media.find({ id });
		if (!details.data) throw new Error("Could not fetch details");

		await client.media.update({
			...details.data,
			status,
			genreIds: details.data.genres?.map((g) => g.genre.id),
			creatorIds: details.data.creators?.map((c) => c.creator.id),
		});

		await fetchMediaAction(mediaUIStore.state.currentPage);
		mediaUIStore.setState((s) => ({ ...s, isUpdating: false }));
		return true;
	} catch (error) {
		console.error("Update media status error:", error);
		mediaUIStore.setState((s) => ({
			...s,
			error: "Failed to update media status",
			isUpdating: false,
		}));
		return false;
	}
};

export const setTypeFilter = (type: string) => {
	mediaUIStore.setState((s) => ({
		...s,
		filters: { ...s.filters, type },
	}));
};

export const setCategoryFilter = (category: string) => {
	mediaUIStore.setState((s) => ({
		...s,
		filters: { ...s.filters, category },
	}));
};
