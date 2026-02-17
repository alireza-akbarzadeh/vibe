import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/orpc/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminAllSubscriptions,
  useAdminSubscriptionStats,
} from "@/hooks/useAdminPolar";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  ExternalLink,
  Loader2,
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(admin)/dashboard/payments/")({
  component: AdminPaymentsPage,
});

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  trialing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  past_due: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  canceled: "bg-red-500/10 text-red-400 border-red-500/20",
  unpaid: "bg-red-500/10 text-red-400 border-red-500/20",
  incomplete: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

function AdminPaymentsPage() {
  const { data: stats, isLoading: statsLoading } =
    useAdminSubscriptionStats();
  const { data: subsData, isLoading: subsLoading } =
    useAdminAllSubscriptions({ page: 1, limit: 50 });

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-10 max-w-350 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Revenue metrics, transactions, and payment analytics
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href="/api/portal" target="_blank" rel="noopener noreferrer">
            Polar Dashboard
            <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </a>
        </Button>
      </div>

      {/* Revenue Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`stat-skel-${i}`} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Monthly Recurring (MRR)"
            value={formatCurrency(stats.totalMrr, stats.currency)}
            icon={DollarSign}
            accent="text-green-400"
            bgAccent="bg-green-500/10"
          />
          <StatCard
            title="Annual Run Rate (ARR)"
            value={formatCurrency(stats.totalArr, stats.currency)}
            icon={TrendingUp}
            accent="text-purple-400"
            bgAccent="bg-purple-500/10"
          />
          <StatCard
            title="Active Subscriptions"
            value={String(stats.activeSubscriptions)}
            subtitle={`${stats.trialingSubscriptions} trialing`}
            icon={Activity}
            accent="text-blue-400"
            bgAccent="bg-blue-500/10"
          />
          <StatCard
            title="Paid Users"
            value={String(stats.paidUserCount)}
            subtitle={`of ${stats.localUserCount} total`}
            icon={Users}
            accent="text-cyan-400"
            bgAccent="bg-cyan-500/10"
          />
        </div>
      ) : null}

      {/* Risk Indicators */}
      {stats && (stats.pastDueSubscriptions > 0 || stats.cancelledSubscriptions > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.pastDueSubscriptions > 0 && (
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-300">
                    {stats.pastDueSubscriptions} past due
                    {stats.pastDueSubscriptions > 1 ? " subscriptions" : " subscription"}
                  </p>
                  <p className="text-xs text-orange-400/70">
                    Payment failed — may need intervention
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {stats.cancelledSubscriptions > 0 && (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <CreditCard className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-300">
                    {stats.cancelledSubscriptions} cancelled
                  </p>
                  <p className="text-xs text-red-400/70">
                    Consider win-back campaigns
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                {subsData
                  ? `${subsData.total} total subscriptions`
                  : "Loading..."}
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/subscriptions/users">
                View all
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={`row-skel-${i}`} className="h-12 w-full" />
              ))}
            </div>
          ) : subsData && subsData.subscriptions.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Period End</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subsData.subscriptions.map((sub) => (
                    <TableRow key={sub.id} className="group">
                      <TableCell className="font-medium text-sm">
                        {sub.customerEmail || (
                          <span className="text-muted-foreground">
                            No email
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {sub.productName}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {formatCurrency(sub.amount, sub.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs capitalize",
                            STATUS_STYLES[sub.status] ||
                            "bg-gray-500/10 text-gray-400",
                          )}
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">
                        {sub.interval || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {sub.currentPeriodEnd
                          ? formatDistanceToNow(
                            new Date(sub.currentPeriodEnd),
                            { addSuffix: true },
                          )
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No transactions found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Transactions will appear here when customers subscribe
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  bgAccent,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  bgAccent: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {title}
          </p>
          <div className={cn("p-2 rounded-lg", bgAccent)}>
            <Icon className={cn("w-4 h-4", accent)} />
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
