import { Store } from "@tanstack/react-store";
import type { VideoReel } from "./server/reels.functions";

interface ReelsState {
	videos: VideoReel[];
	isMuted: boolean;
	activeTab: "following" | "foryou";
}

export const reelsStore = new Store<ReelsState>({
	videos: [],
	isMuted: true,
	activeTab: "foryou",
});

// Actions
export const setVideos = (videos: VideoReel[]) =>
	reelsStore.setState((s) => ({ ...s, videos }));

export const toggleMute = () =>
	reelsStore.setState((s) => ({ ...s, isMuted: !s.isMuted }));

export const setActiveTab = (tab: "following" | "foryou") =>
	reelsStore.setState((s) => ({ ...s, activeTab: tab }));

export const updateReelAction = (videoId: number, action: "like" | "save") => {
	reelsStore.setState((s) => ({
		...s,
		videos: s.videos.map((v) => {
			if (v.id !== videoId) return v;
			if (action === "like") {
				return {
					...v,
					isLiked: !v.isLiked,
					likes: v.isLiked ? v.likes - 1 : v.likes + 1,
				};
			}
			return { ...v, isSaved: !v.isSaved };
		}),
	}));
};

export const toggleFollow = (username: string) => {
	reelsStore.setState((s) => ({
		...s,
		videos: s.videos.map((v) =>
			v.user.username === username
				? { ...v, user: { ...v.user, isFollowing: !v.user.isFollowing } }
				: v,
		),
	}));
};
