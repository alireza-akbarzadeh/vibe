import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	type ErrorComponentProps,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { motion } from "framer-motion";
import BackButton from "@/components/back-button";
import { RouteLayout } from "@/components/root-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import { getSession } from "@/lib/auth/auth-server";
import { createMetadata } from "@/lib/utils";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import AiDevtools from "../lib/ai-devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
	auth: Awaited<ReturnType<typeof getSession>>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: createMetadata({
			charSet: "utf-8",
			viewport: {
				width: "device-width",
				"initial-scale": "1",
				"maximum-scale": "1",
				"user-scalable": "no",
				"viewport-fit": "cover",
			},
			title: import.meta.env.VITE_APP_TITLE,
			description: "vibe streaming platform.",
			robots: "index, follow",
		}),
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	beforeLoad: async () => {
		try {
			const session = await getSession();
			return {
				auth: session,
			};
		} catch (error) {
			console.error("Failed to get session:", error);
			return {
				auth: null,
			};
		}
	},
	component: RouteLayout,
	shellComponent: RootDocument,
	errorComponent: ErrorComponent,
	pendingComponent: PendingComponent,
	notFoundComponent: NotFoundComponent,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="antialiased">
				<ThemeProvider>
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster />
				</ThemeProvider>
				<TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
						AiDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function PendingComponent() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Typography.H1 className="animate-pulse">Loading...</Typography.H1>
		</div>
	);
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
	return (
		<div className="space-y-8 flex flex-col justify-center items-center h-screen px-4 text-center">
			<div className="space-y-2">
				<Typography.H1 className="block bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-5xl font-black">
					Oops!
				</Typography.H1>
				<p className="text-gray-400 font-medium">Something went wrong on our end.</p>
			</div>

			<div className="w-full max-w-lg space-y-4">
				<div className="text-destructive font-mono text-sm bg-destructive/5 border border-destructive/20 p-6 rounded-xl overflow-auto max-h-[300px] text-left">
					<div className="font-bold border-b border-destructive/10 pb-2 mb-2 uppercase tracking-wider text-[10px]">Error Details</div>
					{error instanceof Error ? error.message : String(error)}
					{process.env.NODE_ENV === 'development' && error instanceof Error && error.stack && (
						<pre className="mt-4 text-[10px] opacity-50 overflow-x-auto">
							{error.stack}
						</pre>
					)}
				</div>

				<div className="flex items-center justify-center gap-4">
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
					>
						Try Again
					</button>
					<BackButton />
				</div>
			</div>
		</div>
	);
}

function NotFoundComponent() {
	return (
		<div className="space-y-6 flex flex-col justify-center items-center h-screen px-4 text-center">
			<Typography.H1 className="block bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-6xl font-black tracking-tighter">
				404
			</Typography.H1>
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="text-lg md:text-xl text-gray-400 max-w-md mx-auto leading-relaxed"
			>
				The page you're looking for doesn't exist.
			</motion.p>
			<BackButton />
		</div>
	);
}
