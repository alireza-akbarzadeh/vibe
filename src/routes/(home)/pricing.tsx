import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { PLANS } from "@/domains/plans/plans.constants";
import { Plans } from "@/domains/plans/plans.domains";
import { logger } from "@/lib/logger";
import type { CheckoutInputScheme } from "@/types/subscription";

interface PricingSearch {
  redirectUrl?: string;
}

// Map plan slugs to Polar product IDs (client-safe env vars)
const PLAN_TO_PRODUCT_ID: Record<string, string> = {
  Free: import.meta.env.VITE_POLAR_FREE_PRODUCT_ID,
  "Premium-Monthly": import.meta.env.VITE_POLAR_PREMIUM_MONTHLY_PRODUCT_ID,
  "Premium-Yearly": import.meta.env.VITE_POLAR_PREMIUM_YEARLY_PRODUCT_ID,
  "Family-Monthly": import.meta.env.VITE_POLAR_FAMILY_MONTHLY_PRODUCT_ID,
  "Family-Yearly": import.meta.env.VITE_POLAR_FAMILY_YEARLY_PRODUCT_ID,
};

export const Route = createFileRoute("/(home)/pricing")({
  validateSearch: (search: Record<string, unknown>): PricingSearch => ({
    redirectUrl: typeof search.redirectUrl === 'string' ? search.redirectUrl : undefined
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { redirectUrl } = Route.useSearch();

  const handleCheckout = async (plan: CheckoutInputScheme) => {
    try {
      // Ensure plan has a slug
      if (!plan.slug) {
        toast.error("Invalid plan", {
          description: "Plan is missing a slug identifier"
        });
        return;
      }

      const productId = PLAN_TO_PRODUCT_ID[plan.slug];

      if (!productId) {
        toast.error("Invalid plan", {
          description: "Please select a valid plan"
        });
        return;
      }

      // Build checkout URL with product ID and metadata
      const params = new URLSearchParams({
        products: productId,
      });

      // Add metadata if we have a redirectUrl
      if (redirectUrl) {
        const metadata = JSON.stringify({ redirectUrl });
        params.append("metadata", metadata);
      }

      const checkoutUrl = `/api/checkout?${params.toString()}`;

      // Redirect to checkout
      toast.success("Redirecting to checkout...");
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      logger.error('Checkout error:', err);
      toast.error("Error", {
        description: "An unexpected error occurred"
      });
    }
  }

  return (
    <>
      <RootHeader />
      <Plans plans={PLANS} onCheckout={handleCheckout} />
      <Footer />
    </>
  );
}
