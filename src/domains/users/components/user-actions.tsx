import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserAccount } from "../server/users.functions";
import { AdminNotes } from "./admin-notes";
import { OrgDetails } from "./org-details";
import { QuickLinks } from "./quick-links";
import { SuspendAction } from "./suspend-action";

interface UserActionsProps {
	user: UserAccount;
}

export function UserActions({ user }: UserActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-8 w-8 p-0 hover:bg-muted focus-visible:ring-0"
				>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-72 p-2 rounded-2xl shadow-xl border-border/50"
			>
				<ActionHeader userId={user.id} />

				<QuickLinks user={user} />

				{user.notes && <AdminNotes notes={user.notes} />}

				<DropdownMenuSeparator className="my-2" />

				<OrgDetails organization={user.organization} manager={user.manager} />

				<DropdownMenuSeparator className="my-2" />

				<SuspendAction userId={user.id} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface ActionHeaderProps {
	userId: string;
}

export function ActionHeader({ userId }: ActionHeaderProps) {
	return (
		<div className="flex flex-col px-2 py-2 mb-1">
			<span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
				Management Console
			</span>
			<span className="text-[11px] font-mono font-bold text-primary mt-1.5 truncate">
				ID: {userId}
			</span>
		</div>
	);
}
