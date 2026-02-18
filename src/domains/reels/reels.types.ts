export interface ReelUser {
	username: string;
	avatar: string;
	isFollowing: boolean;
	isVerified: boolean;
}

export interface VideoReel {
	id: string;
	videoUrl: string;
	thumbnail: string;
	user: ReelUser;
	caption: string;
	likes: number;
	comments: number;
	shares: number;
	views: number;
	isLiked: boolean;
	isSaved: boolean;
	soundName: string;
	soundId: string;
}

export interface User {
	username: string;
	avatar: string;
}

export interface CommentItem {
	id: string;
	user: User;
	text: string;
	likes: number;
	isLiked: boolean;
	timestamp: string;
}
