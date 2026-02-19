import { Check } from "lucide-react";

export function CheckItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-3">
			<div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
				<Check className="w-4 h-4" />
			</div>
			<span className="text-gray-300">{text}</span>
		</li>
	);
}
