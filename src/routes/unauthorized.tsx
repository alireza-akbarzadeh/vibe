import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Home, ShieldOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import AuthLayout from "@/domains/auth/auth-layout";

export const Route = createFileRoute("/unauthorized")({
	component: UnauthorizedPage,
	validateSearch: (search: Record<string, unknown>) => ({
		error: (search.error as string) || undefined,
		from: (search.from as string) || undefined,
		requiredRole: (search.requiredRole as string) || undefined,
	}),
});

function UnauthorizedPage() {
	const { error, from, requiredRole } = Route.useSearch();

	return (
		<AuthLayout
			title="Access Denied"
			subtitle="You don't have permission to access this page"
		>
			<div className="text-center py-6 space-y-6">
				{/* Animated icon */}
				<div className="flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
						<div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50">
							<ShieldOff className="w-12 h-12 text-red-400" />
						</div>
					</div>
				</div>

				{/* Error message */}
				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-white">
						{error === "unauthorized"
							? "Unauthorized Access"
							: "Permission Denied"}
					</h1>

					<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
						<p className="text-gray-300 text-sm">
							{error === "unauthorized" ? (
								<>
									This area requires{" "}
									<span className="text-red-400 font-semibold">
										{requiredRole}
									</span>{" "}
									privileges.
								</>
							) : (
								"You don't have the necessary permissions to view this page."
							)}
						</p>
						{from !== "/" && (
							<p className="text-gray-500 text-xs mt-2">
								Attempted to access: <span className="font-mono">{from}</span>
							</p>
						)}
					</div>
				</div>

				{/* Action buttons */}
				<div className="space-y-3 pt-4">
					<Link
						to="/"
						className={buttonVariants({
							className:
								"w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0",
						})}
					>
						<Home className="w-4 h-4 mr-2" />
						Go to Dashboard
					</Link>

					<Link
						to="/"
						className={buttonVariants({
							variant: "outline",
							className:
								"w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10",
						})}
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Go Back
					</Link>
				</div>

				{/* Support link */}
				<div className="pt-6 border-t border-white/10">
					<p className="text-gray-500 text-sm">
						Need access?{" "}
						<Link
							to="/support"
							className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
						>
							Contact your administrator
						</Link>
					</p>
				</div>
			</div>
		</AuthLayout>
	);
}
