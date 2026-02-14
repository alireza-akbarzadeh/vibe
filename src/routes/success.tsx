import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/better-auth";
import { prisma } from "@/lib/db";

const getRedirectUrl = createServerFn({ method: "GET" }).handler(async () => {


  try {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user) return null;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        redirectUrl: { not: null },
      },
      orderBy: { startedAt: "desc" },
      select: { redirectUrl: true },
    });

    return subscription?.redirectUrl || null;
  } catch (error) {
    console.error("Error fetching redirect URL:", error);
    return null;
  }
});

type SuccessSearch = {
  checkout_id?: string;
};

export const Route = createFileRoute("/success")({
  validateSearch: (search: Record<string, unknown>): SuccessSearch => {
    return {
      checkout_id:
        typeof search.checkout_id === "string"
          ? search.checkout_id
          : undefined,
    };
  },
  loader: async () => {
    const redirectUrl = await getRedirectUrl();
    return { redirectUrl };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { checkout_id } = Route.useSearch();
  const { redirectUrl } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-green-600/20 rounded-full blur-[120px]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
          <CardContent className="p-10 text-center space-y-6">
            {/* Animated Check Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold tracking-tight"
            >
              Payment Successful 🎉
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm"
            >
              Your subscription has been activated successfully.
              <br />
              {checkout_id && (
                <span className="text-gray-500 block mt-2 text-xs">
                  Checkout ID: {checkout_id}
                </span>
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
            >
              {redirectUrl ? (
                <Button asChild size="lg" className="rounded-xl">
                  <a href={redirectUrl}>
                    Continue Watching
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              ) : (
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/library">
                    Go to Library
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                asChild
              >
                <Link to="/">Back to Home</Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
