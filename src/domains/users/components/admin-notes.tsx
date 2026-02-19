import { Check, Copy, MessageSquare } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AdminNotes({ notes }: { notes: string }) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		navigator.clipboard.writeText(notes);
		setCopied(true);
		toast.success("Copied to clipboard", {
			icon: <Check className="h-4 w-4 text-emerald-500" />,
		});
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative m-2 overflow-hidden rounded-2xl border border-border/40 bg-muted/30 p-3 transition-all duration-300 hover:bg-muted/50">
			{/* Background Decorative Element */}
			<div className="absolute -right-2 -top-2 opacity-5">
				<MessageSquare className="h-12 w-12 rotate-12 text-foreground" />
			</div>

			<div className="relative space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary/10">
							<MessageSquare className="h-3 w-3 text-primary" />
						</div>
						<span className="text-[10px] font-bold upp~ercase tracking-widest text-muted-foreground/80">
							Internal Memo
						</span>
					</div>

					<button
						onClick={handleCopy}
						className={cn(
							"flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold transition-all",
							copied
								? "bg-emerald-500/10 text-emerald-600"
								: "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
						)}
					>
						{copied ? (
							<>
								<Check className="h-2.5 w-2.5" />
								<span>Copied</span>
							</>
						) : (
							<>
								<Copy className="h-2.5 w-2.5" />
								<span>Copy</span>
							</>
						)}
					</button>
				</div>

				<div className="relative">
					{/* Vertical Accent Line */}
					<div className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-primary/20" />

					<p className="pl-3 text-[11px] font-medium leading-relaxed text-foreground/80 line-clamp-4 italic">
						{notes}
					</p>
				</div>
			</div>
		</div>
	);
}
