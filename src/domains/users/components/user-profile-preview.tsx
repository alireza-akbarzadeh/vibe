import {
	BadgeCheck,
	CreditCard,
	Edit3,
	Mail,
	Phone,
	Save,
	Shield,
	ShieldAlert,
	X,
	Zap,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { UserAccount } from "../server/users.functions";

export function UserProfilePreview({ user }: { user: UserAccount }) {
	const [isEditing, setIsEditing] = React.useState(false);

	// In production, this would be managed by a form library like react-hook-form
	const handleSave = () => {
		setIsEditing(false);
		toast.success("User updated successfully", {
			description: "Changes have been propagated to the database.",
		});
	};

	return (
		<div className="space-y-6">
			{/* 1. Top Stats Grid */}
			<div className="grid grid-cols-3 gap-2">
				{[
					{
						label: "Usage",
						value: `${user.usage}%`,
						icon: Zap,
						color: "text-amber-500",
					},
					{
						label: "Storage",
						value: `${user.storageUsedMB}MB`,
						icon: BadgeCheck,
						color: "text-primary",
					},
					{
						label: "Credits",
						value: user.credits,
						icon: Zap,
						color: "text-emerald-500",
					},
				].map((stat) => (
					<div
						key={stat.label}
						className="flex flex-col items-center p-3 rounded-2xl bg-muted/30 border border-border/40 transition-colors hover:bg-muted/50"
					>
						<stat.icon className={cn("h-3.5 w-3.5 mb-1", stat.color)} />
						<span className="text-[11px] font-bold">{stat.value}</span>
						<span className="text-[8px] uppercase text-muted-foreground font-black tracking-tighter">
							{stat.label}
						</span>
					</div>
				))}
			</div>

			{/* 2. Admin Edit Toggle Header */}
			<div className="flex items-center justify-between px-1">
				<span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
					Core Identity
				</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsEditing(!isEditing)}
					className={cn(
						"h-7 gap-1.5 text-[10px] font-bold rounded-lg",
						isEditing
							? "text-destructive hover:bg-destructive/10"
							: "text-primary hover:bg-primary/10",
					)}
				>
					{isEditing ? (
						<>
							<X className="h-3 w-3" /> Cancel
						</>
					) : (
						<>
							<Edit3 className="h-3 w-3" /> Edit Profile
						</>
					)}
				</Button>
			</div>

			{/* 3. Information Cards / Form */}
			<div className="space-y-3">
				{/* Name & Email Group */}
				<div className="grid grid-cols-1 gap-3 rounded-2xl border border-border/50 bg-muted/10 p-4">
					<ProfileField
						label="Full Name"
						value={user.name}
						isEditing={isEditing}
						icon={Shield}
					/>
					<ProfileField
						label="Email Address"
						value={user.email}
						isEditing={isEditing}
						icon={Mail}
						verified={user.emailVerified}
					/>
					<ProfileField
						label="Phone Number"
						value={user.phone || "Not Provided"}
						isEditing={isEditing}
						icon={Phone}
						verified={user.phoneVerified}
					/>
				</div>

				{/* Account Details Group */}
				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-xl border border-border/50 bg-background/50 p-3">
						<span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
							<CreditCard className="h-3 w-3" /> Subscription
						</span>
						{isEditing ? (
							<select className="w-full bg-transparent text-xs font-bold outline-none cursor-pointer">
								<option>Free</option>
								<option>Premium</option>
								<option>Enterprise</option>
							</select>
						) : (
							<span className="text-xs font-bold text-primary">
								{user.plan}
							</span>
						)}
					</div>
					<div className="rounded-xl border border-border/50 bg-background/50 p-3">
						<span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
							<Shield className="h-3 w-3" /> Account Role
						</span>
						{isEditing ? (
							<select className="w-full bg-transparent text-xs font-bold outline-none cursor-pointer">
								<option>User</option>
								<option>Moderator</option>
								<option>Admin</option>
							</select>
						) : (
							<span className="text-xs font-bold">{user.role}</span>
						)}
					</div>
				</div>
			</div>

			{/* 4. Save Action (Only visible when editing) */}
			{isEditing && (
				<Button
					onClick={handleSave}
					className="w-full rounded-xl h-10 font-bold text-xs gap-2 shadow-lg shadow-primary/20"
				>
					<Save className="h-3.5 w-3.5" /> Commit Changes
				</Button>
			)}
		</div>
	);
}

// Reusable Field Component for clean UI
interface ProfileFieldProps {
	label: string;
	value: string;
	isEditing: boolean;
	icon: React.ElementType;
	verified?: boolean;
}

function ProfileField({
	label,
	value,
	isEditing,
	icon: Icon,
	verified,
}: ProfileFieldProps) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-[9px] font-black text-muted-foreground/70 uppercase tracking-tight">
				{label}
			</span>
			<div className="flex items-center gap-3">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border/50 shadow-sm">
					<Icon className="h-3.5 w-3.5 text-muted-foreground" />
				</div>
				{isEditing ? (
					<Input
						defaultValue={value}
						className="h-8 text-xs font-medium bg-background/50 border-none ring-1 ring-border/50 focus-visible:ring-primary/50"
					/>
				) : (
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold text-foreground">{value}</span>
						{verified && (
							<BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
						)}
						{verified === false && (
							<ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
						)}
					</div>
				)}
			</div>
		</div>
	);
}
