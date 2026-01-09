import { createFileRoute } from "@tanstack/react-router";
import { Derived, Store, useStore } from "@tanstack/react-store";

import { fullName, store } from "@/lib/demo-store";

export const Route = createFileRoute("/(demo)/demo/store")({
	component: DemoStore,
});
const countStore = new Store(0);

const doubledStore = new Derived({
	fn: () => countStore.state * 2,
	deps: [countStore],
});

doubledStore.mount();

function Counter() {
	const count = useStore(countStore);
	const doubled = useStore(doubledStore);
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="text-2xl">Count: {count}</div>
			<div className="text-2xl">Doubled: {doubled}</div>
			<div className="flex gap-4">
				<button
					type="button"
					onClick={() => countStore.setState((c) => c - 1)}
					className="px-4 py-2 bg-red-500 text-white rounded-lg"
				>
					Decrement
				</button>
				<button
					type="button"
					onClick={() => countStore.setState((c) => c + 1)}
					className="px-4 py-2 bg-green-500 text-white rounded-lg"
				>
					Increment
				</button>
			</div>
		</div>
	)
}

function FirstName() {
	const firstName = useStore(store, (state) => state.firstName);
	return (
		<input
			type="text"
			value={firstName}
			onChange={(e) =>
				store.setState((state) => ({ ...state, firstName: e.target.value }))
			}
			className="bg-white/10 rounded-lg px-4 py-2 outline-none border border-white/20 hover:border-white/40 focus:border-white/60 transition-colors duration-200 placeholder-white/40"
		/>
	)
}

function LastName() {
	const lastName = useStore(store, (state) => state.lastName);
	return (
		<input
			type="text"
			value={lastName}
			onChange={(e) =>
				store.setState((state) => ({ ...state, lastName: e.target.value }))
			}
			className="bg-white/10 rounded-lg px-4 py-2 outline-none border border-white/20 hover:border-white/40 focus:border-white/60 transition-colors duration-200 placeholder-white/40"
		/>
	)
}

function FullName() {
	const fName = useStore(fullName);
	return (
		<div className="bg-white/10 rounded-lg px-4 py-2 outline-none ">
			{fName}
		</div>
	)
}

function DemoStore() {
	return (
		<div
			className="min-h-[calc(100vh-32px)] text-white p-8 flex items-center justify-center w-full h-full"
			style={{
				backgroundImage:
					"radial-gradient(50% 50% at 80% 80%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)",
			}}
		>
			<div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg flex flex-col gap-4 text-3xl min-w-1/2">
				<h1 className="text-4xl font-bold mb-5">Store Example</h1>
				<FirstName />
				<LastName />
				<FullName />
				<Counter />
			</div>
		</div>
	)
}
