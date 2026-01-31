import {
	CheckCircle2,
	Globe,
	User as UserIcon,
	Wallet
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "@/components/ui/forms/form";
import { Textarea } from "@/components/ui/forms/textarea";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import type { UserAccount } from "../server/users.functions";
import { userAccountSchema } from "../user.schema";

interface UserFormProps {
	initialData?: Partial<UserAccount>;
	onSuccess: () => void;
}

export function AdvancedUserForm({ initialData, onSuccess }: UserFormProps) {
	const form = useForm(userAccountSchema, {
		defaultValues: {
			name: initialData?.name ?? "",
			email: initialData?.email ?? "",
			role: initialData?.role ?? "User",
			status: initialData?.status ?? "active",
			plan: initialData?.plan ?? "Free",
			billingStatus: initialData?.billingStatus ?? "active",
			accountBalance: initialData?.accountBalance ?? 0,
			credits: initialData?.credits ?? 0,
			city: initialData?.city ?? "",
			country: initialData?.country ?? "",
			timezone: initialData?.timezone ?? "UTC",
			tags: initialData?.tags ?? [],
			notes: initialData?.notes ?? "",
		},
		onSubmit: async ({ value }) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("Saving User Account:", value);
			toast.success("User account synchronized successfully");
			onSuccess();
		},
	});

	return (
		<form.Root className="max-w-none space-y-10 pb-8">
			{/* SECTION 1: CORE IDENTITY */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
						<UserIcon className="h-3.5 w-3.5 text-primary" />
					</div>
					<h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Identity & Access</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<form.Field
						name="name"
						render={(field) => (
							<field.Container label="Full Name">
								<Input {...field.Controller} className="h-11 rounded-xl bg-muted/5 border-border/40" />
							</field.Container>
						)}
					/>
					<form.Field
						name="email"
						render={(field) => (
							<field.Container label="Work Email">
								<Input {...field.Controller} type="email" className="h-11 rounded-xl bg-muted/5 border-border/40" />
							</field.Container>
						)}
					/>
				</div>

				<div className="grid grid-cols-3 gap-4">
					<form.Field name="role" render={(field) => (
						<field.Container label="System Role">
							<Select onValueChange={field.handleChange} defaultValue={field.state.value}>
								<SelectTrigger className="h-11 rounded-xl bg-muted/5 border-border/40"><SelectValue /></SelectTrigger>
								<SelectContent className="rounded-xl"><SelectItem value="User">User</SelectItem><SelectItem value="Moderator">Moderator</SelectItem><SelectItem value="Admin">Admin</SelectItem></SelectContent>
							</Select>
						</field.Container>
					)} />
					<form.Field name="status" render={(field) => (
						<field.Container label="Status">
							<Select onValueChange={field.handleChange} defaultValue={field.state.value}>
								<SelectTrigger className="h-11 rounded-xl bg-muted/5 border-border/40"><SelectValue /></SelectTrigger>
								<SelectContent className="rounded-xl"><SelectItem value="active">Active</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="flagged">Flagged</SelectItem></SelectContent>
							</Select>
						</field.Container>
					)} />
					<form.Field name="plan" render={(field) => (
						<field.Container label="Tiers">
							<Select onValueChange={field.handleChange} defaultValue={field.state.value}>
								<SelectTrigger className="h-11 rounded-xl bg-muted/5 border-border/40"><SelectValue /></SelectTrigger>
								<SelectContent className="rounded-xl"><SelectItem value="Free">Free</SelectItem><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Premium">Premium</SelectItem></SelectContent>
							</Select>
						</field.Container>
					)} />
				</div>
			</div>

			{/* SECTION 2: LOCALIZATION */}
			<div className="space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
						<Globe className="h-3.5 w-3.5 text-emerald-500" />
					</div>
					<h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Localization</h3>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<form.Field name="country" render={(field) => (
						<field.Container label="Country">
							<Input {...field.Controller} className="h-11 rounded-xl bg-muted/5 border-border/40" />
						</field.Container>
					)} />
					<form.Field name="timezone" render={(field) => (
						<field.Container label="Timezone">
							<Input {...field.Controller} placeholder="UTC+0" className="h-11 rounded-xl bg-muted/5 border-border/40" />
						</field.Container>
					)} />
				</div>
			</div>

			{/* SECTION 3: BILLING & CREDITS */}
			<div className="p-5 rounded-[2rem] bg-muted/20 border border-border/40 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Wallet className="h-4 w-4 text-primary" />
						<h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Financial Parameters</h3>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-6">
					<form.Field name="accountBalance" render={(field) => (
						<field.Container label="Balance ($)">
							<Input
								{...field.Controller}
								type="number"
								className="h-11 rounded-xl bg-background border-border/40 font-mono"
								onChange={(e) => field.handleChange(Number(e.target.value))}
							/>
						</field.Container>
					)} />
					<form.Field name="credits" render={(field) => (
						<field.Container label="System Credits">
							<Input
								{...field.Controller}
								type="number"
								className="h-11 rounded-xl bg-background border-border/40 font-mono"
								onChange={(e) => field.handleChange(Number(e.target.value))}
							/>
						</field.Container>
					)} />
				</div>
			</div>

			{/* SECTION 4: METADATA */}
			<div className="space-y-4">
				<form.Field name="notes" render={(field) => (
					<field.Container label="Internal Admin Notes" detail="Visible only to administrators and moderators">
						<Textarea
							{...field.Controller}
							className="min-h-[100px] rounded-2xl bg-muted/5 border-border/40 resize-none"
							placeholder="Add specific user behavior notes or history..."
						/>
					</field.Container>
				)} />
			</div>

			<form.Submit className="h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs border-t border-white/20 shadow-xl shadow-primary/20">
				<div className="flex items-center gap-2">
					<CheckCircle2 className="h-4 w-4" />
					Commit Account Changes
				</div>
			</form.Submit>
		</form.Root>
	);
}
