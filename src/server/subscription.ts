// src/server/subscription.ts

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { polarClient, POLAR_SLUG_TO_PRODUCT } from "@/integrations/polar/polar-client";
import { auth } from "@/lib/better-auth";
import { prisma } from "@/lib/db";
import { Http } from "@/orpc/helpers/http";

// Checkout Subscription
const CheckoutInput = z.object({
  productId: z.string().optional(),
  slug: z.string().optional(),
  referenceId: z.string().optional(),
});
export type CheckoutInputScheme = z.infer<typeof CheckoutInput>;

export const checkoutSubscription = createServerFn({
  method: "POST",
})
  .inputValidator(CheckoutInput)
  .handler(async ({ data }) => {
    const { productId, slug, referenceId } = data;

    if (!productId && !slug) {
      setResponseStatus(Http.BAD_REQUEST, "Either productId or slug is required");
      return;
    }

    const headers = getRequestHeaders();

    const session = await auth.api.getSession({ headers });
    if (!session?.user) {
      setResponseStatus(Http.UNAUTHORIZED, "You need an account to proceed. Please sign up or log in.");
      return;
    }

    const checkoutReferenceId =
      referenceId ?? `ref-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const effectiveProductId = productId ?? (slug ? POLAR_SLUG_TO_PRODUCT[slug] : undefined);
    if (!effectiveProductId) {
      setResponseStatus(Http.BAD_REQUEST, "Unknown product slug or productId");
      return;
    }

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        productId: effectiveProductId,
        referenceId: checkoutReferenceId,
        status: "FREE",
      },
    });

    const response = await auth.api.checkout({
      body: {
        products: productId ? [productId] : undefined,
        slug,
        referenceId: checkoutReferenceId,
      },
      headers,
    });

    let checkoutUrl: string;
    if (typeof response === "string") {
      checkoutUrl = response;
    } else if (response && "url" in response) {
      checkoutUrl = (response as { url: string }).url;
    } else {
      setResponseStatus(Http.INTERNAL_SERVER_ERROR, "Unexpected response from checkout");
      return;
    }

    return { url: checkoutUrl };
  });

// Get Subscription Status
export const getSubscriptionStatus = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      sessionToken: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const headers = new Headers();
    if (data.sessionToken) headers.set("Authorization", `Bearer ${data.sessionToken}`);

    try {
      const session = await auth.api.getSession({ headers });
      if (!session?.user) throw new Error("Not authenticated");

      return {
        status: session.user.subscriptionStatus || "NONE",
        customerId: session.user.customerId || null,
      };
    } catch {
      throw new Error("Not authenticated");
    }
  });

// Cancel Subscription
export const cancelSubscription = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      subscriptionId: z.string().optional(),
      sessionToken: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const headers = new Headers();
    if (data.sessionToken) headers.set("Authorization", `Bearer ${data.sessionToken}`);

    const session = await auth.api.getSession({ headers });
    if (!session?.user) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        customerId: true,
        subscriptionStatus: true,
      },
    });

    if (!user) throw new Error("User not found");

    let subscriptionId = data.subscriptionId;
    if (!subscriptionId && user.customerId) {
      try {
        const subs = await polarClient.subscriptions.list({
          customerId: user.customerId,
          active: true,
        });
        subscriptionId = subs?.result?.items?.[0]?.id;
      } catch (err) {
        console.error("Error fetching subscriptions from Polar:", err);
      }
    }

    if (!subscriptionId) {
      return { error: "No active subscription found", alreadyCancelled: true };
    }

    try {
      await polarClient.subscriptions.update({
        id: subscriptionId,
        subscriptionUpdate: { cancelAtPeriodEnd: true },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "CANCELLED" },
      });

      return { success: true, pendingCancellation: true };
    } catch (err) {
      console.error("Subscription cancel error:", err);

      if (String(err).includes("AlreadyCanceledSubscription")) {
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: "CANCELLED" },
        });
        return { success: true, pendingCancellation: true };
      }

      return { error: String(err), status: 500 };
    }
  });
