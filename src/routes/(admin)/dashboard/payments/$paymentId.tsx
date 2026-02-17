import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	Ban,
	Calendar,
	CheckCircle2,
	Clock,
	Copy,
	CreditCard,
	ExternalLink,
	Loader2,
	Mail,
	Package,
	Shield,
	User,
	XCircle,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	useAdminCancelSubscription,
	useAdminSubscriptionDetail,
} from "@/hooks/useAdminPolar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(admin)/dashboard/payments/$paymentId")({
	component: RouteComponent,
});

const STATUS_CONFIG: Record<
	string,
	{ icon: typeof CheckCircle2; color: string; bg: string; label: string }
> = {
	active: {
		icon: CheckCircle2,
		color: "text-green-400",
		bg: "bg-green-500/10 border-green-500/20",
		label: "Active",
	},
	trialing: {
		icon: Clock,
		color: "text-blue-400",
		bg: "bg-blue-500/10 border-blue-500/20",
		label: "Trialing",
	},
	past_due: {
		icon: AlertCircle,
		color: "text-orange-400",
		bg: "bg-orange-500/10 border-orange-500/20",
		label: "Past Due",
	},
	canceled: {
		icon: XCircle,
		color: "text-red-400",
		bg: "bg-red-500/10 border-red-500/20",
		label: "Canceled",
	},
	unpaid: {
		icon: XCircle,
		color: "text-red-400",
		bg: "bg-red-500/10 border-red-500/20",
		label: "Unpaid",
	},
};

function formatCurrency(amount: number, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount / 100);
}

function formatDate(dateStr: string | null) {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function formatDateTime(dateStr: string | null) {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function daysUntil(dateStr: string | null) {
	if (!dateStr) return null;
	const diff = new Date(dateStr).getTime() - Date.now();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function InfoRow({
	icon: Icon,
	label,
	value,
	mono = false,
	copyable = false,
}: {
	icon: typeof User;
	label: string;
	value: string;
	mono?: boolean;
	copyable?: boolean;
}) {
	return (
		<div className="flex items-start justify-between gap-4 py-2.5">
			<div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
				<Icon className="h-4 w-4" />
				{label}
			</div>
			<div className="flex items-center gap-2 text-right">
				<span className={cn("text-sm", mono && "font-mono text-xs")}>
					{value || "—"}
				</span>
				{copyable && value && value !== "—" && (
					<button
						type="button"
						onClick={() => {
							navigator.clipboard.writeText(value);
							toast.success("Copied to clipboard");
						}}
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						<Copy className="h-3.5 w-3.5" />
					</button>
				)}
			</div>
		</div>
	);
}

function RouteComponent() {
	const { paymentId } = Route.useParams();
	const { data, isLoading, error } = useAdminSubscriptionDetail(paymentId);
	const cancelMutation = useAdminCancelSubscription();
	const [showCancel, setShowCancel] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const cancelReasonDetailId = useId();

	const handleCancel = () => {
		cancelMutation.mutate(
			{ subscriptionId: paymentId, reason: cancelReason || undefined },
			{
				onSuccess: (result) => {
					toast.success(result.message);
					setShowCancel(false);
					setCancelReason("");
				},
				onError: () => toast.error("Failed to cancel subscription"),
			},
		);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="p-6 max-w-3xl mx-auto">
				<Link
					to="/dashboard/payments"
					className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Payments
				</Link>
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<AlertCircle className="h-12 w-12 text-red-400/30 mb-4" />
							<p className="text-lg font-medium">Subscription not found</p>
							<p className="text-sm text-muted-foreground mt-1">
								This subscription may have been deleted or the ID is invalid.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const statusConfig = STATUS_CONFIG[data.status] || STATUS_CONFIG.active;
	const StatusIcon = statusConfig.icon;
	const canCancel =
		data.status === "active" ||
		data.status === "trialing" ||
		data.status === "past_due";
	const days = daysUntil(data.currentPeriodEnd);

	return (
		<div className="p-4 md:p-6 lg:p-10 max-w-250 mx-auto space-y-6">
			{/* Back */}
			<Link
				to="/dashboard/payments"
				className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to Payments
			</Link>

			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold tracking-tight">
							Subscription Detail
						</h1>
						<Badge
							variant="outline"
							className={cn("capitalize gap-1.5", statusConfig.bg)}
						>
							<StatusIcon className={cn("h-3.5 w-3.5", statusConfig.color)} />
							{statusConfig.label}
							{data.cancelAtPeriodEnd && data.status === "active" && (
								<span className="text-[10px]">(ending)</span>
							)}
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground font-mono">{data.id}</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" asChild>
						<a
							href={`https://dashboard.polar.sh/subscriptions/${data.id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="gap-2"
						>
							<ExternalLink className="h-4 w-4" />
							Polar
						</a>
					</Button>
					{canCancel && (
						<Button
							variant="outline"
							size="sm"
							className="gap-2 text-red-400 hover:text-red-400 hover:bg-red-500/10 border-red-500/20"
							onClick={() => setShowCancel(true)}
						>
							<Ban className="h-4 w-4" />
							Cancel
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Billing Card */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<CreditCard className="h-4 w-4" />
								Billing Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-0 divide-y divide-border/30">
							<InfoRow icon={Package} label="Plan" value={data.productName} />
							<InfoRow
								icon={CreditCard}
								label="Amount"
								value={`${formatCurrency(data.amount, data.currency)}${data.interval ? ` / ${data.interval}` : ""}`}
							/>
							<InfoRow
								icon={Calendar}
								label="Current Period"
								value={`${formatDate(data.currentPeriodStart)} — ${formatDate(data.currentPeriodEnd)}`}
							/>
							{days !== null && data.status === "active" && (
								<InfoRow
									icon={Clock}
									label="Next Renewal"
									value={
										data.cancelAtPeriodEnd
											? `Cancels in ${days} days`
											: `${days} days`
									}
								/>
							)}
							<InfoRow
								icon={Calendar}
								label="Started"
								value={formatDateTime(data.startedAt)}
							/>
							{data.endedAt && (
								<InfoRow
									icon={XCircle}
									label="Ended"
									value={formatDateTime(data.endedAt)}
								/>
							)}
						</CardContent>
					</Card>

					{/* Customer Card */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<User className="h-4 w-4" />
								Customer
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-0 divide-y divide-border/30">
							<InfoRow
								icon={Mail}
								label="Email"
								value={data.customerEmail || "—"}
								copyable
							/>
							<InfoRow
								icon={User}
								label="Name"
								value={data.customerName || "—"}
							/>
							<InfoRow
								icon={Shield}
								label="Customer ID"
								value={data.customerId}
								mono
								copyable
							/>
							<InfoRow
								icon={Shield}
								label="Product ID"
								value={data.productId}
								mono
								copyable
							/>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Local User Mapping */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<Shield className="h-4 w-4" />
								Platform Mapping
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{data.localUserId ? (
								<>
									<div>
										<p className="text-xs text-muted-foreground">
											Local User ID
										</p>
										<div className="flex items-center gap-2 mt-0.5">
											<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded truncate">
												{data.localUserId}
											</code>
											<button
												type="button"
												onClick={() => {
													navigator.clipboard.writeText(data.localUserId ?? "");
													toast.success("Copied");
												}}
												className="text-muted-foreground hover:text-foreground shrink-0"
											>
												<Copy className="h-3.5 w-3.5" />
											</button>
										</div>
									</div>
									<div>
										<p className="text-xs text-muted-foreground">Local Email</p>
										<p className="text-sm mt-0.5">{data.localUserEmail}</p>
									</div>
									<Badge
										variant="outline"
										className="bg-green-500/10 text-green-400 border-green-500/20 mt-1"
									>
										<CheckCircle2 className="h-3 w-3 mr-1" />
										Linked
									</Badge>
								</>
							) : (
								<div className="text-center py-4">
									<AlertCircle className="h-8 w-8 text-orange-400/30 mx-auto mb-2" />
									<p className="text-sm font-medium">Not linked</p>
									<p className="text-xs text-muted-foreground mt-1">
										No local user matched to this Polar customer
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Quick Info */}
					<Card>
						<CardContent className="p-4 space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Status</span>
								<Badge
									variant="outline"
									className={cn("capitalize text-xs", statusConfig.bg)}
								>
									{statusConfig.label}
								</Badge>
							</div>
							<Separator className="bg-border/30" />
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Billing Cycle</span>
								<span className="capitalize">{data.interval || "N/A"}</span>
							</div>
							<Separator className="bg-border/30" />
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Cancel at End</span>
								<span>{data.cancelAtPeriodEnd ? "Yes" : "No"}</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Cancel Dialog */}
			<AlertDialog
				open={showCancel}
				onOpenChange={(open) => {
					if (!open) {
						setShowCancel(false);
						setCancelReason("");
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<Ban className="w-5 h-5 text-red-400" />
							Cancel Subscription
						</AlertDialogTitle>
						<AlertDialogDescription className="space-y-3">
							<p>
								Cancel the subscription for{" "}
								<strong>{data.customerEmail || "this customer"}</strong> on{" "}
								<strong>{data.productName}</strong>?
							</p>
							<p className="text-xs text-muted-foreground">
								The subscription will remain active until the end of the current
								billing period ({formatDate(data.currentPeriodEnd)}).
							</p>
							<div>
								<label
									htmlFor={cancelReasonDetailId}
									className="text-xs font-medium text-foreground mb-1 block"
								>
									Reason (optional)
								</label>
								<Input
									id={cancelReasonDetailId}
									placeholder="e.g. Customer requested via support"
									value={cancelReason}
									onChange={(e) => setCancelReason(e.target.value)}
									className="mt-1"
								/>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={cancelMutation.isPending}>
							Keep Active
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleCancel}
							disabled={cancelMutation.isPending}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{cancelMutation.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Cancelling...
								</>
							) : (
								"Cancel Subscription"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
