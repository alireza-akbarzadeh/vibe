import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
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
import { orpc } from "@/orpc/client";

export const Route = createFileRoute("/(admin)/dashboard/audit-logs/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useQuery({
		...orpc.users.listAuditLogs.queryOptions({
			input: {
				page: 1,
				limit: 100,
			},
		}),
	});

	const getActionColor = (action: string) => {
		if (action.includes("CREATE")) return "bg-green-500/10 text-green-500";
		if (action.includes("UPDATE")) return "bg-blue-500/10 text-blue-500";
		if (action.includes("DELETE")) return "bg-red-500/10 text-red-500";
		if (action.includes("ASSIGN")) return "bg-purple-500/10 text-purple-500";
		return "bg-gray-500/10 text-gray-500";
	};

	return (
		<div className="space-y-6 p-4 md:p-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
				<p className="text-muted-foreground text-sm mt-1">
					Track all system activities and changes
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>System Activity Log</CardTitle>
					<CardDescription>
						{data ? `${data.total} total entries` : "Loading..."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{[...Array(10)].map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					) : data && data.logs.length > 0 ? (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Timestamp</TableHead>
										<TableHead>Action</TableHead>
										<TableHead>Resource</TableHead>
										<TableHead>Resource ID</TableHead>
										<TableHead>User ID</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.logs.map((log) => (
										<TableRow key={log.id}>
											<TableCell className="text-xs text-muted-foreground">
												{formatDistanceToNow(new Date(log.createdAt), {
													addSuffix: true,
												})}
											</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className={getActionColor(log.action)}
												>
													{log.action}
												</Badge>
											</TableCell>
											<TableCell className="font-medium">
												{log.resource}
											</TableCell>
											<TableCell className="text-xs font-mono text-muted-foreground">
												{log.resourceId || "—"}
											</TableCell>
											<TableCell className="text-xs font-mono">
												{log.userId.slice(0, 12)}...
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="text-center py-12 text-muted-foreground">
							No audit logs found
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
