"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function TermsOfServiceDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="text-purple-400 hover:text-purple-300"
				>
					Terms of Service
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Terms of Service</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-gray-700 mt-2">
					Mock Terms of Service content goes here. Lorem ipsum dolor sit amet,
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
