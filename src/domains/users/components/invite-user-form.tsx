import { Loader2, Mail, Shield, UserPlus } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteUserForm({ onSuccess }: { onSuccess: () => void }) {
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setLoading(false);
		toast.success("Invitation Sent", {
			description: "The user will receive an email to complete their setup.",
		});
		onSuccess();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 pb-6">
			<div className="space-y-4">
				{/* Email Field */}
				<div className="space-y-2">
					<Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
						Work Email
					</Label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							required
							type="email"
							placeholder="name@company.com"
							className="pl-10 h-12 rounded-xl bg-muted/20 border-border/40 focus:ring-primary/20"
						/>
					</div>
				</div>

				{/* Role Selection */}
				<div className="space-y-2">
					<Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
						Access Level
					</Label>
					<div className="grid grid-cols-3 gap-2">
						{["User", "Moderator", "Admin"].map((role) => (
							<label key={role} className="relative cursor-pointer group">
								<input
									type="radio"
									name="role"
									value={role}
									className="peer sr-only"
									defaultChecked={role === "User"}
								/>
								<div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-muted/10 peer-checked:border-primary peer-checked:bg-primary/5 transition-all group-hover:bg-muted/30">
									<Shield className="h-4 w-4 mb-1 text-muted-foreground peer-checked:text-primary" />
									<span className="text-[10px] font-bold">{role}</span>
								</div>
							</label>
						))}
					</div>
				</div>
			</div>

			<Button
				type="submit"
				disabled={loading}
				className="w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest"
			>
				{loading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<UserPlus className="mr-2 h-4 w-4" />
				)}
				{loading ? "Sending..." : "Send Invitation"}
			</Button>
		</form>
	);
}
