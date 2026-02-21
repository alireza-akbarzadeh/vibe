import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/(admin)/dashboard/subscriptions/users/")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { data, isLoading } = useQuery({
		...orpc.polarAdmin.listAllSubscriptions.queryOptions({
			input: {
				page: 1,
				limit: 100,
			},
		}),
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-500/10 text-green-500";
			case "trialing":
				return "bg-blue-500/10 text-blue-500";
			case "past_due":
				return "bg-orange-500/10 text-orange-500";
			case "canceled":
				return "bg-red-500/10 text-red-500";
			default:
				return "bg-gray-500/10 text-gray-500";
		}
	};

	const totalRevenue =
		data?.subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;
	const activeCount =
		data?.subscriptions.filter((s) => s.status === "active").length || 0;

	return (
		<div className="space-y-6 p-4 md:p-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					User Subscriptions
				</h1>
				<p className="text-muted-foreground text-sm mt-1">
					Manage all active user subscriptions
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Total Subscriptions</CardDescription>
						<CardTitle className="text-3xl">{data?.total || 0}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Active Subscriptions</CardDescription>
						<CardTitle className="text-3xl flex items-center gap-2">
							{activeCount}
							<TrendingUp className="h-5 w-5 text-green-500" />
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription>Monthly Revenue</CardDescription>
						<CardTitle className="text-3xl flex items-center gap-2">
							<DollarSign className="h-6 w-6" />
							{(totalRevenue / 100).toFixed(2)}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Subscriptions</CardTitle>
					<CardDescription>
						{data ? `${data.total} total subscriptions` : "Loading..."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{[...Array(10)].map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					) : data && data.subscriptions.length > 0 ? (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Customer</TableHead>
										<TableHead>Product</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Interval</TableHead>
										<TableHead>Current Period End</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.subscriptions.map((subscription) => (
										<TableRow key={subscription.id}>
											<TableCell className="text-xs">
												{subscription.customerEmail || "No email"}
											</TableCell>
											<TableCell className="font-medium">
												{subscription.productName}
											</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className={getStatusColor(subscription.status)}
												>
													{subscription.status}
												</Badge>
											</TableCell>
											<TableCell>
												${(subscription.amount / 100).toFixed(2)}{" "}
												{subscription.currency}
											</TableCell>
											<TableCell className="capitalize">
												{subscription.interval || "—"}
											</TableCell>
											<TableCell className="text-xs text-muted-foreground">
												{subscription.currentPeriodEnd
													? formatDistanceToNow(
															new Date(subscription.currentPeriodEnd),
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
						<div className="text-center py-12 text-muted-foreground">
							No subscriptions found
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
