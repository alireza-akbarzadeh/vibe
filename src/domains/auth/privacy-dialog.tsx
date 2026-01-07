import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function PrivacyPolicyDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className={buttonVariants({
						variant: "link",
						className: "text-purple-400 hover:text-purple-300",
					})}
				>
					Privacy Policy
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Privacy Policy</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-gray-700 mt-2">
					Mock Privacy Policy content goes here. Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum
					vestibulum. Cras venenatis euismod malesuada.
				</p>
				<div className="mt-4 text-right">
					<DialogClose asChild>
						<Button variant="outline">Close</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
