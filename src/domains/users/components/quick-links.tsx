import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, History, User } from "lucide-react";
import { AppDialog } from "@/components/app-dialog";
import { Button } from "@/components/ui/button";
import type { UserAccount } from "../server/users.functions";
import { UserActivityPreview } from "./user-activity-preview";
import { UserProfilePreview } from "./user-profile-preview";

export function QuickLinks({ user }: { user: UserAccount }) {
	const navigate = useNavigate();

	return (
		<div className="grid grid-cols-2 gap-2 p-1">
			<AppDialog
				component="drawer"
				title="Account Overview"
				description={`Internal data for ${user.name}`}
				trigger={
					<Button
						variant="outline"
						className="h-auto py-2.5 flex-col gap-1.5 text-[10px] rounded-xl group transition-all"
					>
						<User className="h-4 w-4 group-hover:text-primary transition-colors" />
						<span>Profile</span>
					</Button>
				}
			>
				<div className="space-y-6">
					<UserProfilePreview user={user} />
					<Button
						variant="secondary"
						className="w-full gap-2 rounded-xl text-xs font-bold"
						onClick={() =>
							navigate({
								to: `/dashboard/users/$userId`,
								params: { userId: user.id },
							})
						}
					>
						<ExternalLink className="h-3 w-3" />
						Detailed Management Page
					</Button>
				</div>
			</AppDialog>

			{/* Activity Dialog */}
			<AppDialog
				component="drawer"
				title="Security & Logs"
				description="Live audit trail of user interactions"
				trigger={
					<Button
						variant="outline"
						className="h-auto py-2.5 flex-col gap-1.5 text-[10px] rounded-xl group transition-all"
					>
						<History className="h-4 w-4 group-hover:text-primary transition-colors" />
						<span>Activity</span>
					</Button>
				}
			>
				<UserActivityPreview user={user} />
			</AppDialog>
		</div>
	);
}
