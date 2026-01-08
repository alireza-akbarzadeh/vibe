import { Store } from "@tanstack/react-store";
import type { ArtistType } from "@/types/app";

// Define the state shape
export interface DiscoveryState {
	selectedArtists: ArtistType[];
	searchQuery: string;
	activeFilter: string;
}

export const discoveryStore = new Store<DiscoveryState>({
	selectedArtists: [],
	searchQuery: "",
	activeFilter: "all",
});

export const discoveryActions = {
	setSearch: (query: string) => {
		discoveryStore.setState((state) => ({ ...state, searchQuery: query }));
	},
	setFilter: (filter: string) => {
		discoveryStore.setState((state) => ({ ...state, activeFilter: filter }));
	},
	toggleArtist: (artist: ArtistType) => {
		discoveryStore.setState((state) => {
			const exists = state.selectedArtists.some((a) => a.id === artist.id);
			return {
				...state,
				selectedArtists: exists
					? state.selectedArtists.filter((a) => a.id !== artist.id)
					: [...state.selectedArtists, artist],
			};
		});
	},
};
