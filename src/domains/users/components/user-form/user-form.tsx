import { useNavigate } from "@tanstack/react-router";
import { Mail, MapPin, Shield, User, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useForm } from "@/components/ui/forms/form";
import { CompactField } from "@/domains/dashboard/components/user-table/compact-field";

import type { UserAccount } from "../../server/users.functions";
import { userAccountSchema } from "../../user.schema";
import UserFormHeader from "./user-form-header";

export function UserForm({ initialData, mode = "create" }: { initialData?: Partial<UserAccount>; mode?: "create" | "edit" }) {
	const navigate = useNavigate();
	const isEditMode = mode === "edit" || !!initialData?.id;

	const form = useForm(userAccountSchema, {
		defaultValues: initialData ?? {
			name: "",
			email: "",
			phone: "",
			role: "User",
			status: "active",
			country: "US",
			timezone: "UTC",
			locale: "en-US",
		},
		onSubmit: async () => {
			await new Promise((r) => setTimeout(r, 800));
			toast.success("Identity Saved Successfully");
			navigate({ to: "/dashboard/users" });
		},
	});

	const containerStyle = "max-w-[1100px] mx-auto bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[1.5rem] overflow-hidden shadow-2xl";

	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-6 font-sans">
			<div className={containerStyle}>
				{/* Header Section */}
				<UserFormHeader isEditMode={isEditMode} />

				<form.Root className="p-8 space-y-10">
					{/* SECTION 1: CORE IDENTITY */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
						<CompactField
							form={form}
							name="name"
							label="Employee Name"
							placeholder="Enter name"
							icon={User}
						/>
						<CompactField
							form={form}
							name="role"
							label="Designation"
							type="select"
							placeholder="Select Role"
							options={["Admin", "Moderator", "User"] as const}
							icon={Users}
						/>
						<CompactField
							form={form}
							name="status"
							label="Account Status"
							type="select"
							options={["active", "pending", "suspended"] as const}
							icon={Zap}
						/>
						<CompactField
							form={form}
							name="plan"
							label="Subscription"
							type="select"
							options={["Free", "Standard", "Premium"] as const}
							icon={Shield}
						/>
					</div>

					{/* SECTION 2: CONTACT DETAILS */}
					<div className="pt-8 border-t border-white/5">
						<h2 className="text-lg font-bold text-white mb-6">Contact Details</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
							<CompactField
								form={form}
								name="phone"
								label="Phone Link"
								type="phone"
							/>
							<CompactField
								form={form}
								name="email"
								label="Office Email"
								placeholder="email@company.com"
								icon={Mail}
							/>
							<div className="md:col-span-2">
								<CompactField
									form={form}
									name="country"
									label="Region"
									placeholder="Enter country"
									icon={MapPin}
								/>
							</div>
						</div>
					</div>

					{/* FOOTER ACTIONS */}
					<div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
						<Button
							type="button"
							variant="ghost"
							onClick={() => navigate({ to: ".." })}
							className="px-8 h-11 rounded-xl text-slate-400 font-bold hover:bg-white/5 transition-colors"
						>
							Cancel
						</Button>
						<form.Submit className="px-10 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20">
							{isEditMode ? "Update Identity" : "Save Entity"}
						</form.Submit>
					</div>
				</form.Root>
			</div>
		</div>
	);
}