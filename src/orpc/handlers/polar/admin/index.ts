import { base } from "../../../router/base";
import { archiveProduct } from "./archive-product";
import { adminCancelSubscription } from "./cancel-subscription";
import { createProduct } from "./create-product";
import { getSubscriptionDetail } from "./get-subscription-detail";
import { getSubscriptionStats } from "./get-subscription-stats";
import { listAllCustomers } from "./list-all-customers";
import { listAllSubscriptions } from "./list-all-subscriptions";
import { updateProduct } from "./update-product";

export const PolarAdminRouter = base.router({
	// Product Management
	createProduct,
	updateProduct,
	archiveProduct,

	// Admin Views
	listAllSubscriptions,
	listAllCustomers,

	// Subscription Management
	cancelSubscription: adminCancelSubscription,
	getSubscriptionDetail,
	getSubscriptionStats,
});
