import { os } from "@/orpc/root";
import { cancelSubscription } from "./cancel-subscription";
import { createCheckout } from "./create-checkout";
import { getCustomer } from "./get-customer";
import { getProduct } from "./get-product";
import { getSubscription } from "./get-subscription";
import { listProducts } from "./list-products";
import { listSubscriptions } from "./list-subscriptions";
import { updateSubscription } from "./update-subscription";
import { getWebhookStats, syncSubscriptionStatus } from "./webhook-utils";

export const PolarRouter = os.router({
	// Products
	listProducts,
	getProduct,

	// Subscriptions
	listSubscriptions,
	getSubscription,
	cancelSubscription,
	updateSubscription,

	// Customer
	getCustomer,

	// Checkout
	createCheckout,

	// Webhooks & Utilities
	getWebhookStats,
	syncSubscriptionStatus,
});
