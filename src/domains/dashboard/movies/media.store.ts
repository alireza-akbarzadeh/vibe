import { Store } from "@tanstack/store";
import { toast } from "sonner";
import { orpc } from "@/orpc/client";
import type { ListMediaInput } from "@/orpc/models/media.input.schema";
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
		type MediaListParams = {
			page: number;
			limit: number;
			status?: ListMediaInput["status"];
			search?: string;
			type?: ListMediaInput["type"];
		};

		const baseParams: MediaListParams = {
			page,
			limit,
			status: state.filters.status as ListMediaInput["status"],
		};

		if (search?.trim()) {
			baseParams.search = search.trim();
		} else if (state.filters.search?.trim()) {
			baseParams.search = state.filters.search.trim();
		}

		// Only add type if it's a valid value
		if (
			state.filters.type &&
			["MOVIE", "EPISODE", "TRACK"].includes(state.filters.type)
		) {
			baseParams.type = state.filters.type as ListMediaInput["type"];
		}

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
export const bulkCreateMediaAction = async (items: MediaItem[]) => {
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
		const item = mediaUIStore.state.media.find((m) => m.id === id);
		if (!item) throw new Error("Item not found in store");

		const details = await client.media.find({ id });
		if (!details.data) throw new Error("Could not fetch details");

		await client.media.update({
			id,
			title: details.data.title,
			description: details.data.description,
			thumbnail: details.data.thumbnail,
			duration: details.data.duration,
			releaseYear: details.data.releaseYear,
			type: details.data.type,
			videoUrl: details.data.videoUrl,
			audioUrl: details.data.audioUrl,
			collectionId: details.data.collectionId,
			sortOrder: details.data.sortOrder,
			genreIds: details.data.genres?.map((g) => g.genre.id),
			creatorIds: details.data.creators?.map((c) => c.creator.id),
			status,
		});

		await fetchMediaAction(mediaUIStore.state.currentPage);
		mediaUIStore.setState((s) => ({ ...s, isUpdating: false }));
		return true;
	} catch (_error) {
		toast.error("Update media status error:", {
			description: "An error occurred while updating media status.",
		});
		mediaUIStore.setState((s) => ({
			...s,
			error: "Failed to update media status",
			isUpdating: false,
		}));
		return false;
	}
};

export const bulkUpdateMediaStatusAction = async (
	ids: string[],
	status: "DRAFT" | "REVIEW" | "PUBLISHED" | "REJECTED",
) => {
	mediaUIStore.setState((s) => ({ ...s, isUpdating: true, error: null }));
	try {
		const updatePromises = ids.map(async (id) => {
			const details = await client.media.find({ id });
			if (!details.data) throw new Error(`Could not fetch details for ${id}`);

			return client.media.update({
				id,
				title: details.data.title,
				description: details.data.description,
				thumbnail: details.data.thumbnail,
				duration: details.data.duration,
				releaseYear: details.data.releaseYear,
				type: details.data.type,
				videoUrl: details.data.videoUrl,
				status,
				audioUrl: details.data.audioUrl,
				collectionId: details.data.collectionId,
				sortOrder: details.data.sortOrder,
				genreIds: details.data.genres?.map((g) => g.genre.id),
				creatorIds: details.data.creators?.map((c) => c.creator.id),
			});
		});

		await Promise.all(updatePromises);

		await fetchMediaAction(mediaUIStore.state.currentPage);
		mediaUIStore.setState((s) => ({ ...s, isUpdating: false }));
		return true;
	} catch (_error) {
		toast.error("Bulk update media status error:", {
			description: "An error occurred while bulk updating media status.",
		});
		mediaUIStore.setState((s) => ({
			...s,
			error: "Failed to bulk update media status",
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
