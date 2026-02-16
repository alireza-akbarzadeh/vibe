import { env } from "@/env";
import { polarClient } from "@/integrations/polar/polar-client";
import { authedProcedure } from "@/orpc/context";
import {
	CheckoutCreateInputSchema,
	CheckoutResponseSchema,
} from "../../models/polar";

/**
 * Create a checkout session for a product
 */
export const createCheckout = authedProcedure
	.input(CheckoutCreateInputSchema)
	.output(CheckoutResponseSchema)
	.handler(async ({ input, context, errors }) => {
		try {
			const successUrl =
				input.successUrl ||
				env.POLAR_SUCCESS_URL ||
				`${env.VITE_APP_URL}/success`;

			const checkout = await polarClient.checkouts.create({
				products: [input.productPriceId],
				successUrl,
				...(input.customerEmail && { customerEmail: input.customerEmail }),
				...(context.user.customerId && {
					customerId: context.user.customerId,
				}),
				...(!input.customerEmail &&
					context.user.email && { customerEmail: context.user.email }),
			});

			return {
				id: checkout.id,
				url: checkout.url || "",
				customerId: checkout.customerId,
				productId: checkout.productId,
				productPriceId: checkout.productPriceId,
				amount: checkout.amount,
				currency: checkout.currency,
				status: checkout.status as string,
			};
		} catch (error) {
			console.error("Error creating checkout:", error);
			throw errors.INTERNAL_ERROR({
				message: "Failed to create checkout session",
			});
		}
	});
