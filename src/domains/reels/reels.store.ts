import { Store } from "@tanstack/react-store";
import type { VideoReel } from "./reels.types";

interface ReelsState {
	videos: VideoReel[];
	isMuted: boolean;
	activeTab: "following" | "foryou";
	activeVideoId: string | null;
	focusedVideoId: string | null; // Tracks which video is in Full Size
	isPressing: boolean; // Tracks if user is holding the screen
	commentModalOpen: boolean;
	showHeartId: string | null; // NEW: Tracks which video shows the like heart
	moreMenuVideoId: string | null; // NEW: Tracks which video has the more menu open
	reactions: Record<string, string | null>;
}

export const reelsStore = new Store<ReelsState>({
	videos: [],
	isMuted: true,
	activeTab: "foryou",
	activeVideoId: null,
	focusedVideoId: null,
	isPressing: false,
	commentModalOpen: false,
	showHeartId: null,
	moreMenuVideoId: null,
	reactions: {},
});

/* --- ACTIONS --- */

export const setVideos = (videos: VideoReel[]) =>
	reelsStore.setState((s) => ({ ...s, videos }));

export const toggleMute = () =>
	reelsStore.setState((s) => ({ ...s, isMuted: !s.isMuted }));

export const setActiveTab = (tab: "following" | "foryou") =>
	reelsStore.setState((s) => ({ ...s, activeTab: tab }));

export const setIsPressing = (isPressing: boolean) =>
	reelsStore.setState((s) => ({ ...s, isPressing }));

export const toggleFocusVideo = (videoId: string | null) =>
	reelsStore.setState((s) => ({
		...s,
		focusedVideoId: s.focusedVideoId === videoId ? null : videoId,
	}));

// Heart Animation Action
export const triggerLikeAnimation = (videoId: string | null) => {
	reelsStore.setState((s) => ({ ...s, showHeartId: videoId }));
	// Automatically clear the heart after 800ms
	if (videoId) {
		setTimeout(() => {
			reelsStore.setState((s) => ({ ...s, showHeartId: null }));
		}, 800);
	}
};

// More Menu Action
export const setMoreMenuVideo = (videoId: string | null) =>
	reelsStore.setState((s) => ({ ...s, moreMenuVideoId: videoId }));

// Reaction Action
export const setVideoReaction = (videoId: string, emoji: string) => {
	reelsStore.setState((s) => ({
		...s,
		reactions: { ...s.reactions, [videoId]: emoji },
	}));
};

// Modal Actions
export const openComments = (videoId: string) =>
	reelsStore.setState((s) => ({
		...s,
		activeVideoId: videoId,
		commentModalOpen: true,
	}));

export const closeComments = () =>
	reelsStore.setState((s) => ({ ...s, commentModalOpen: false }));

export const updateReelAction = (videoId: string, action: "like" | "save") => {
	reelsStore.setState((s) => {
		const video = s.videos.find((v) => v.id === videoId);

		// If liking a video that wasn't liked yet, trigger heart motion
		if (action === "like" && video && !video.isLiked) {
			triggerLikeAnimation(videoId);
		}

		return {
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
		};
	});
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
