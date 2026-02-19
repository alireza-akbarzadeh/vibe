import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { lazy, Suspense } from "react";
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
	auth: Awaited<ReturnType<typeof getSession>>;
}

const LazyErrorComponent = lazy(
	() => import("@/components/error-component.tsx"),
);
const LazyNotFoundComponent = lazy(
	() => import("@/components/not-found-component.tsx"),
);

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
	errorComponent: (props) => (
		<Suspense fallback={<PendingComponent />}>
			<LazyErrorComponent {...props} />
		</Suspense>
	),
	pendingComponent: PendingComponent,
	notFoundComponent: () => (
		<Suspense fallback={<PendingComponent />}>
			<LazyNotFoundComponent />
		</Suspense>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="antialiased">
				<ThemeProvider>
					<TooltipProvider>
						<Suspense fallback={<PendingComponent />}>{children}</Suspense>
					</TooltipProvider>
					<Toaster />
				</ThemeProvider>
				{import.meta.env.DEV && (
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
				)}
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
