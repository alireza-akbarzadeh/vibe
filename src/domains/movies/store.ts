import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import type { CategoryVariant } from "../components/category-nav";

export type MoviesState = {
	activeCategory: CategoryVariant;
};

export const moviesStore = new Store<MoviesState>({
	activeCategory: "all",
});

export function useMoviesStore<T>(selector: (state: MoviesState) => T) {
	return useStore(moviesStore, selector);
}

export const setCategory = (category: CategoryVariant) => {
	moviesStore.setState((state) => ({
		...state,
		activeCategory: category,
	}));
};
