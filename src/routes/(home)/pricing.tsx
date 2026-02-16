import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { PLANS } from "@/domains/plans/plans.constants";
import { Plans } from "@/domains/plans/plans.domains";
import { useCreateCheckout } from "@/hooks/usePolar";
import { logger } from "@/lib/logger";
import { getCurrentUrl } from "@/lib/utils";
import type { CheckoutInputScheme } from "@/types/subscription";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

interface PricingSearch {
  redirectUrl?: string;
}

export const Route = createFileRoute("/(home)/pricing")({
  validateSearch: (search: Record<string, unknown>): PricingSearch => ({
    redirectUrl: typeof search.redirectUrl === 'string' ? search.redirectUrl : undefined
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { redirectUrl } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate()
  const auth = router.options.context?.auth;
  const user = auth?.user
  const createCheckout = useCreateCheckout();

  const handleCheckout = async (plan: CheckoutInputScheme) => {
    try {
      const redirectPath = getCurrentUrl()
      if (!user) {
        toast.error("Authentication required", {
          description: "Please log in or create an account to continue with your subscription.",
        });
        navigate({ to: "/login", search: { redirectUrl: redirectPath } })
        return;
      }
      if (plan.slug === "Free") {
        toast.info("You're currently on the Free plan.", {
          description: "Upgrade anytime to unlock premium features.",
        });
        return;
      }

      // Ensure plan has priceId
      if (!plan.productId) {
        toast.error("Plan unavailable", {
          description: "This subscription option is temporarily unavailable. Please try again later.",
        });
        return;
      }

      // Create Polar checkout session
      const result = await createCheckout.mutateAsync({
        productPriceId: plan.productId,
        successUrl: redirectUrl || `${window.location.origin}/library/subscription`,
      });

      // Redirect to Polar checkout
      if (result.url) {
        toast.success("Redirecting to checkout...");
        window.location.href = result.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: unknown) {
      logger.error('Checkout error:', err);
      toast.error("Error", {
        description: "Failed to create checkout session"
      });
    }
  }

  return (
    <>
      <RootHeader />
      <Plans
        plans={PLANS}
        onCheckout={handleCheckout}
        userSubscription={{
          status: user?.subscriptionStatus || "FREE",
          currentPlan: user?.currentPlan || null,
        }}
      />
      <Footer />
    </>
  );
}
