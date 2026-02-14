import { RootHeader } from "@/components/root-header";
import Footer from "@/domains/home/footer";
import { getPlans, type PlanType } from "@/domains/plans/plan.server";
import { Plans } from "@/domains/plans/plans.domains";
import { type CheckoutInputScheme, checkoutSubscription } from "@/server/subscription";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

interface LoaderData {
  plans: PlanType[];
}

export const Route = createFileRoute("/(home)/pricing")({
  component: RouteComponent,
  loader: async (): Promise<LoaderData> => {
    const result = await getPlans();
    return { plans: result.plans };
  },
});

function RouteComponent() {
  const checkoutFn = useServerFn(checkoutSubscription);
  const { plans } = Route.useLoaderData();

  const handleCheckout = async (plan: CheckoutInputScheme) => {
    try {
      const result = await checkoutFn({ data: plan });

      if (result?.url) {
        toast.success("Redirecting to checkout...");
        window.location.href = result.url;
      } else {
        toast.error("Unable to start checkout. Please try again.");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message?.includes("Unauthorized")
          ? "You need an account first. Please sign up or log in."
          : err instanceof Error && err.message
            ? err.message
            : "Something went wrong. Please try again.";
      toast.error("Checkout failed", { description: msg });
    }
  };

  return (
    <>
      <RootHeader />
      <Plans plans={plans} onCheckout={handleCheckout} />
      <Footer />
    </>
  );
}
