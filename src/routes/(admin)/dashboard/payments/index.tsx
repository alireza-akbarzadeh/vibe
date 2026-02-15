import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from 'date-fns'
import { DollarSign, CreditCard } from 'lucide-react'

export const Route = createFileRoute('/(admin)/dashboard/payments/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: subscriptionsData, isLoading } = useQuery({
    ...orpc.polarAdmin.listAllSubscriptions.queryOptions({
      input: {
        page: 1,
        limit: 100,
      },
    }),
  });

  // Calculate payment metrics from subscription data
  const totalRevenue = subscriptionsData?.subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;
  const activePayments = subscriptionsData?.subscriptions.filter(s => s.status === 'active').length || 0;
  const monthlyRecurring = subscriptionsData?.subscriptions
    .filter(s => s.status === 'active' && s.interval === 'month')
    .reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'trialing':
        return 'bg-blue-500/10 text-blue-500';
      case 'past_due':
        return 'bg-orange-500/10 text-orange-500';
      case 'canceled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor all payments and transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              {(totalRevenue / 100).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Payments</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              {activePayments}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Recurring (MRR)</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              {(monthlyRecurring / 100).toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            {subscriptionsData ? `${subscriptionsData.total} total transactions` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : subscriptionsData && subscriptionsData.subscriptions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Period Start</TableHead>
                    <TableHead>Period End</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionsData.subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="text-xs">
                        {subscription.customerEmail || 'No email'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {subscription.productName}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${(subscription.amount / 100).toFixed(2)} {subscription.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(subscription.currentPeriodStart), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {subscription.currentPeriodEnd
                          ? formatDistanceToNow(new Date(subscription.currentPeriodEnd), { addSuffix: true })
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No payment history found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
