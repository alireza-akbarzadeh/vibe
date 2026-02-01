import { createServerFn } from "@tanstack/react-start";
import type { CommentItem, VideoReel } from "../reels.types";

const mockVideos: VideoReel[] = [
	{
		id: 1,
		videoUrl:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		thumbnail:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
		user: {
			username: "creativestudio",
			avatar:
				"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
			isFollowing: false,
			isVerified: true,
		},
		caption: "Amazing sunset vibes 🌅 #nature #sunset #peaceful",
		likes: 45200,
		comments: 892,
		shares: 234,
		views: 1200000,
		isLiked: false,
		isSaved: false,
		soundName: "Original Sound - creativestudio",
		soundId: "sound_123",
	},
	{
		id: 2,
		videoUrl:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		thumbnail:
			"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
		user: {
			username: "musicvibes",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
			isFollowing: true,
			isVerified: true,
		},
		caption: "New track dropping soon! 🎵🔥 What do you think?",
		likes: 89300,
		comments: 1523,
		shares: 567,
		views: 2400000,
		isLiked: true,
		isSaved: false,
		soundName: "Summer Vibes Mix 2026",
		soundId: "sound_456",
	},
	{
		id: 3,
		videoUrl:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		thumbnail:
			"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
		user: {
			username: "travelmore",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
			isFollowing: false,
			isVerified: true,
		},
		caption: "Hidden gems in Bali 🏝️✨ #travel #bali #paradise",
		likes: 123400,
		comments: 2341,
		shares: 890,
		views: 3500000,
		isLiked: false,
		isSaved: true,
		soundName: "Chill Tropical Beats",
		soundId: "sound_789",
	},
	{
		id: 4,
		videoUrl:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		thumbnail:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
		user: {
			username: "fitlife",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
			isFollowing: false,
			isVerified: false,
		},
		caption:
			"Morning workout routine 💪 Try this! #fitness #workout #motivation",
		likes: 67800,
		comments: 1124,
		shares: 445,
		views: 890000,
		isLiked: false,
		isSaved: false,
		soundName: "Workout Motivation Mix",
		soundId: "sound_101",
	},
	{
		id: 5,
		videoUrl:
			"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
		thumbnail:
			"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
		user: {
			username: "foodieheaven",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
			isFollowing: true,
			isVerified: true,
		},
		caption: "Best pizza recipe ever! 🍕👨‍🍳 #food #cooking #pizza",
		likes: 234500,
		comments: 3456,
		shares: 1234,
		views: 5600000,
		isLiked: true,
		isSaved: true,
		soundName: "Cooking ASMR Sounds",
		soundId: "sound_202",
	},
];

const comments: CommentItem[] = [
	{
		id: 1,
		user: {
			username: "johndoe",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
		},
		text: "This is amazing! 🔥",
		likes: 234,
		isLiked: false,
		timestamp: "2h ago",
	},
	{
		id: 2,
		user: {
			username: "janesmit",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
		},
		text: "Where is this place? I need to visit!",
		likes: 89,
		isLiked: true,
		timestamp: "5h ago",
	},
	{
		id: 3,
		user: {
			username: "creativemind",
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
		},
		text: "Love the editing style! What app did you use?",
		likes: 156,
		isLiked: false,
		timestamp: "1d ago",
	},
	{
		id: 4,
		user: {
			username: "explorer_x",
			avatar:
				"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
		},
		text: "Can't stop watching this 😍",
		likes: 445,
		isLiked: true,
		timestamp: "1d ago",
	},
	{
		id: 5,
		user: {
			username: "photogeek",
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
		},
		text: "The cinematography is insane! Tutorial please?",
		likes: 567,
		isLiked: false,
		timestamp: "2d ago",
	},
];

export const getReelComments = createServerFn({ method: "GET" }).handler(
	async (): Promise<CommentItem[]> => {
		await new Promise((r) => setTimeout(r, 500));
		return comments;
	},
);

export const getVideoReels = createServerFn({ method: "GET" }).handler(
	async (): Promise<VideoReel[]> => {
		await new Promise((r) => setTimeout(r, 500));
		return mockVideos;
	},
);
