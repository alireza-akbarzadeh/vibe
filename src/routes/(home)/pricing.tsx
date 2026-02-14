import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { PLANS } from "@/domains/plans/plans.constants";
import { Plans } from "@/domains/plans/plans.domains";
import { useErrorHandler } from "@/lib/app-error";
import { type CheckoutInputScheme, checkoutSubscription } from "@/server/subscription";

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
  const checkoutFn = useServerFn(checkoutSubscription);
  const { handleError } = useErrorHandler();
  const { redirectUrl } = Route.useSearch();

  const handleCheckout = async (plan: CheckoutInputScheme) => {

    try {
      const result = await checkoutFn({
        data: {
          ...plan,
          redirectUrl
        }
      });
      console.log(result)
      if (result?.url) {
        toast.success("Redirecting to checkout...");
        window.location.href = result.url;
      } else {
        toast.error("Unable to start checkout. Please try again.");
      }
    } catch (err: unknown) {
      handleError(err, {
        showToast: true,
        redirectOnUnauthorized: true,
        callbackUrl: redirectUrl ? `/pricing?redirectUrl=${encodeURIComponent(redirectUrl)}` : '/pricing'
      });
    };
  }

  return (
    <>
      <RootHeader />
      <Plans plans={PLANS} onCheckout={handleCheckout} />
      <Footer />
    </>
  );
}
