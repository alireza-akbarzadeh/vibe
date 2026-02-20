import { os } from "@/orpc/root";
import { createReview } from "./create";
import { deleteReview } from "./delete";
import { getUserReview, listReviews, markHelpful } from "./get";
import { updateReview } from "./update";

export const ReviewRouter = os.router({
	create: createReview,
	update: updateReview,
	delete: deleteReview,
	list: listReviews,
	getUserReview: getUserReview,
	markHelpful: markHelpful,
});
