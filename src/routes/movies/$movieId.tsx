import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieRouteComponent,
});

function MovieRouteComponent() {
	return (
		<div className="relative min-h-screen flex items-center bg-black text-white p-5">
			movie detais
		</div>
	);
}
