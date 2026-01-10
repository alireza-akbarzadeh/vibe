import fontsourceRobot from "@fontsource-variable/roboto?url";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	type ErrorComponentProps,
	HeadContent,
	Scripts,
	ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import { createMetadata } from "@/lib/utils";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import AiDevtools from "../lib/ai-devtools";
import StoreDevtools from "../lib/demo-store-devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: createMetadata({
			charSet: 'utf-8',
			viewport: {
				'width': 'device-width',
				'initial-scale': '1',
				'maximum-scale': '1',
				'user-scalable': 'no',
				'viewport-fit': 'cover',
			},
			title: import.meta.env.VITE_APP_TITLE,
			description: 'A fully type-safe boilerplate with a focus on UX and DX, complete with multiple examples.',
			robots: 'index, follow',
		}),
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: 'stylesheet',
				href: fontsourceRobot,
			},
		],
	}),
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
			<body>
				<ThemeProvider>
					<TooltipProvider >
						{children}
					</TooltipProvider>
					<Toaster />
				</ThemeProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						StoreDevtools,
						TanStackQueryDevtools,
						AiDevtools,
					]}
				/>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}


function PendingComponent() {

	return (
		<div className='space-y-6 p-6'>
			<Typography.H1>
				Loading...
			</Typography.H1>
		</div>
	)
}

function ErrorComponent({ error }: ErrorComponentProps) {
	return (
		<RootDocument>
			<div className='space-y-6 p-6'>
				<Typography.H1>
					Error
				</Typography.H1>
				<p className='text-destructive'>
					{error.message}
				</p>
			</div>
		</RootDocument>
	)
}

function NotFoundComponent() {
	return (
		<div className='space-y-6'>
			<Typography.H1>
				404 Not Found
			</Typography.H1>
		</div>
	)
}
