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
	const errorMessage =
		error instanceof Error ? error.message : String(error);

	const errorStack =
		process.env.NODE_ENV === "development" &&
			error instanceof Error &&
			error.stack
			? error.stack
			: null;

	const fullError = `
Application Error Report
------------------------
Message:
${errorMessage}

Stack Trace:
${errorStack ?? "Not available"}
`;

	const handleCopy = async () => {
		await navigator.clipboard.writeText(fullError);
		alert("Error details copied to clipboard.");
	};

	const handleOpenInChatGPT = () => {
		const prompt = encodeURIComponent(
			`I'm getting this error in my React/Next.js application. Can you help me debug it?\n\n${fullError}`
		);
		window.open(`https://chat.openai.com/?q=${prompt}`, "_blank");
	};

	return (
		<div className="space-y-10 flex flex-col justify-center items-center h-screen px-4 text-center">
			<div className="space-y-3 max-w-xl">
				<h1 className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-5xl font-black">
					Well… that wasn’t supposed to happen.
				</h1>
				<p className="text-gray-400 text-lg">
					We ran into an unexpected issue. Don’t worry — your data is safe.
					You can try again, go back, or copy the error details to investigate further.
				</p>
			</div>

			<div className="w-full max-w-2xl space-y-6">
				<div className="text-destructive font-mono text-sm bg-destructive/5 border border-destructive/20 p-6 rounded-xl overflow-auto max-h-[300px] text-left">
					<div className="font-bold border-b border-destructive/10 pb-2 mb-3 uppercase tracking-wider text-xs">
						Technical Details
					</div>

					<div>{errorMessage}</div>

					{errorStack && (
						<pre className="mt-4 text-[10px] opacity-60 overflow-x-auto">
							{errorStack}
						</pre>
					)}
				</div>

				<div className="flex flex-wrap items-center justify-center gap-4">
					<button
						onClick={() => window.location.reload()}
						className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
					>
						Try Again
					</button>

					<button
						onClick={handleCopy}
						className="px-6 py-2 border border-gray-500 rounded-full font-semibold hover:bg-gray-800 transition-colors"
					>
						Copy Error
					</button>

					<button
						onClick={handleOpenInChatGPT}
						className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
					>
						Open in ChatGPT
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
