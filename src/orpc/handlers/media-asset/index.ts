import { base } from "@/orpc/router/base";
import { bulkCreateImages } from "./image-create";
import { deleteAllImages, deleteImage } from "./image-delete";
import { getMediaImages, listImages } from "./image-get";
import { bulkCreateVideos } from "./video-create";
import { deleteAllVideos, deleteVideo } from "./video-delete";
import { getMediaVideos, listVideos } from "./video-get";

/**
 * Media Asset Router - Manage videos and images for media items
 *
 * Video Endpoints:
 * - bulkCreateVideos: Import videos from TMDB (trailers, teasers, etc.)
 * - listVideos: List videos with filters
 * - getMediaVideos: Get all videos grouped by type
 * - deleteVideo: Delete single video
 * - deleteAllVideos: Delete all videos for a media
 *
 * Image Endpoints:
 * - bulkCreateImages: Import images from TMDB (backdrops, posters, etc.)
 * - listImages: List images with filters
 * - getMediaImages: Get all images grouped by type
 * - deleteImage: Delete single image
 * - deleteAllImages: Delete all images for a media
 */
export const MediaAssetRouter = base.router({
	// Video operations
	bulkCreateVideos,
	listVideos,
	getMediaVideos,
	deleteVideo,
	deleteAllVideos,

	// Image operations
	bulkCreateImages,
	listImages,
	getMediaImages,
	deleteImage,
	deleteAllImages,
});
