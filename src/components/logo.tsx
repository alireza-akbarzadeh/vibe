import { Link } from "@tanstack/react-router";

export function Logo() {
	return (
		<Link to="/" className="flex items-center gap-3">
			<div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
				<span className="text-white font-bold text-xl">V</span>
			</div>
			<span className="text-2xl font-bold text-white hidden md:block">
				Vibe
			</span>
		</Link>
	);
}
