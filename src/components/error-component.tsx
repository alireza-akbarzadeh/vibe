import type { ErrorComponentProps } from "@tanstack/react-router";
import BackButton from "@/components/back-button";

export default function ErrorComponent({ error }: ErrorComponentProps) {
	const errorMessage = error instanceof Error ? error.message : String(error);

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
			`I'm getting this error in my React/Next.js application. Can you help me debug it?\n\n${fullError}`,
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
					We ran into an unexpected issue. Don’t worry — your data is safe. You
					can try again, go back, or copy the error details to investigate
					further.
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
