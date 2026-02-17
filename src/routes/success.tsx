import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Film,
  Headphones,
  Music,
  Shield,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/better-auth";
import { prisma } from "@/lib/db";

/* ------------------------------------------------------------------ */
/*  Server function                                                    */
/* ------------------------------------------------------------------ */

const getCheckoutDetails = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const headers = getRequestHeaders();
      const session = await auth.api.getSession({ headers });

      if (!session?.user) return { redirectUrl: null, planName: null };

      const subscription = await prisma.subscription.findFirst({
        where: { userId: session.user.id },
        orderBy: { startedAt: "desc" },
        select: { redirectUrl: true, status: true },
      });

      return {
        redirectUrl: subscription?.redirectUrl || null,
        planName: session.user.currentPlan || null,
      };
    } catch {
      return { redirectUrl: null, planName: null };
    }
  },
);

/* ------------------------------------------------------------------ */
/*  Route                                                              */
/* ------------------------------------------------------------------ */

type SuccessSearch = { checkout_id?: string };

export const Route = createFileRoute("/success")({
  validateSearch: (search: Record<string, unknown>): SuccessSearch => ({
    checkout_id:
      typeof search.checkout_id === "string"
        ? search.checkout_id
        : undefined,
  }),
  loader: async () => getCheckoutDetails(),
  component: SuccessPage,
});

/* ------------------------------------------------------------------ */
/*  Confetti particles (simple CSS-driven)                             */
/* ------------------------------------------------------------------ */

function ConfettiParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const delay = Math.random() * 2;
        const duration = 2.5 + Math.random() * 2;
        const size = 4 + Math.random() * 6;
        const colors = [
          "bg-green-400",
          "bg-purple-400",
          "bg-pink-400",
          "bg-cyan-400",
          "bg-yellow-400",
        ];
        const color = colors[i % colors.length];

        return (
          <motion.div
            key={`confetti-${i}-${left}`}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", opacity: 0, rotate: 360 }}
            transition={{ duration, delay, ease: "linear" }}
            style={{ left, width: size, height: size, position: "absolute" }}
            className={`rounded-sm ${color}`}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function SuccessPage() {
  const { checkout_id } = Route.useSearch();
  const { redirectUrl, planName } = Route.useLoaderData();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const perks = [
    { icon: Film, label: "Ad-free movies & shows" },
    { icon: Music, label: "Unlimited music" },
    { icon: Headphones, label: "Offline downloads" },
    { icon: Sparkles, label: "AI recommendations" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-green-900/15 via-transparent to-emerald-900/10" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 bg-green-600/15 rounded-full blur-[120px]"
        />
      </div>

      {showConfetti && <ConfettiParticles />}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-5"
      >
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
          {/* Green top accent */}
          <div className="h-1 bg-linear-to-r from-green-500 via-emerald-500 to-green-400" />

          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            {/* Animated check */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 14,
                delay: 0.15,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/25 rounded-full blur-xl scale-150" />
                <div className="relative bg-green-500/10 border border-green-500/20 rounded-full p-4">
                  <CheckCircle2 className="w-14 h-14 text-green-400" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                Payment Successful!
              </h1>
              {planName && (
                <p className="text-green-400 text-sm font-medium">
                  {planName} plan activated
                </p>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-gray-400 text-sm leading-relaxed"
            >
              Your subscription is now active. You have full access to all
              premium features. A confirmation email has been sent to your
              inbox.
            </motion.p>

            {/* Perks */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              {perks.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/3 border border-white/5"
                >
                  <Icon className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-xs text-gray-300">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              {redirectUrl ? (
                <Button asChild className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white rounded-xl py-5 font-semibold">
                  <a href={redirectUrl}>
                    Continue Watching
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              ) : (
                <Button asChild className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white rounded-xl py-5 font-semibold">
                  <Link to="/">
                    Start Exploring
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                asChild
                className="flex-1 rounded-xl py-5 border-white/15 bg-white/5 hover:bg-white/10 text-white"
              >
                <Link to="/library/subscription">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Subscription
                </Link>
              </Button>
            </motion.div>

            {/* Transaction reference */}
            {checkout_id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-2"
              >
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  Transaction ID: {checkout_id}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Security note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-gray-600 mt-4"
        >
          Secured by Polar · Cancel anytime from your account
        </motion.p>
      </motion.div>
    </div>
  );
}
