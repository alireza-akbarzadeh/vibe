import { useNavigate } from "@tanstack/react-router";
import { Building2, Lock, Mail, MapPin, Shield, User, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm } from "@/components/ui/forms/form";
import { CompactField } from "@/domains/dashboard/components/user-table/compact-field";

import type { UserAccount } from "../../server/users.functions";
import { userAccountSchema } from "../../user.schema";
import UserFormHeader from "./user-form-header";

export function UserForm({ initialData, mode = "create" }: { initialData?: Partial<UserAccount>; mode?: "create" | "edit" }) {
	const navigate = useNavigate();
	const isEditMode = mode === "edit" || !!initialData?.id;
	console.log('initialData:', initialData);

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
			accountBalance: 0,
			address: "",
			plan: "Free",
			billingStatus: "active",
			credits: 0,
			avatar: "",
			city: "",
			createdAt: "",
			updatedAt: "",
			organization: "",
			manager: "",
			notes: "",
			tags: [],
			devices: [],
			emailVerified: "",
			failedLoginAttempts: 0,
			joinedDate: "",
			joinedAt: "",
			lastLogin: "",
			lastSeenAt: "",
			lockedUntil: null,
			mfaMethods: [],
			profileComplete: 0,
			storageUsedMB: 0,
			subscriptionEnd: null,
			usage: 0,
			sessionsActive: 0,
			streamingHours: 0,
			playlistsCount: 0,
		},
		onSubmit: async () => {
			await new Promise((r) => setTimeout(r, 800));
			toast.success("Identity Saved Successfully");
			navigate({ to: "/dashboard/users" });
		},
	});



	type CountryOption = { code: string; name: string; flag: string };

	const countries: CountryOption[] = [
		{ code: "US", name: "United States", flag: "🇺🇸" },
		{ code: "USA", name: "United States", flag: "🇺🇸" },
		{ code: "UK", name: "United Kingdom", flag: "🇬🇧" },
		{ code: "CA", name: "Canada", flag: "🇨🇦" },
	];

	const billingStatusOptions = ["active", "past_due", "cancelled", "trialing"] as const;
	const timezones = [
		"UTC",
		"America/New_York",
		"America/Los_Angeles",
		"America/Chicago",
		"America/Denver",
		"America/Phoenix",
		"Europe/London",
		"Europe/Paris",
		"Asia/Tokyo",
		"Asia/Shanghai",
		"Australia/Sydney"
	] as const;
	const locales = ["en-US", "en-GB", "es-ES", "fr-FR", "de-DE", "ja-JP"] as const;

	return (
		<div className="min-h-screen  bg-[#020408] text-slate-400  px-6 font-sans">
			<div className={"bg-[#0a0c10] border border-white/5 rounded-2xl overflow-hidden shadow-2xl"}>
				<UserFormHeader isEditMode={isEditMode} />

				<form.Root className="p-8">
					<Accordion type="multiple" defaultValue={["identity", "contact", "organization", "billing"]} className="space-y-6">
						{/* SECTION 1: CORE IDENTITY */}
						<AccordionItem value="identity" className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm">
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<h2 className="text-lg font-bold text-white">Core Identity</h2>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
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
							</AccordionContent>
						</AccordionItem>

						{/* SECTION 2: CONTACT DETAILS */}
						<AccordionItem value="contact" className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm">
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<h2 className="text-lg font-bold text-white">Contact Details</h2>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
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
									<CompactField
										form={form}
										name="address"
										label="Address"
										placeholder="Enter address"
										icon={MapPin}
									/>
									<CompactField
										form={form}
										name="city"
										label="City"
										placeholder="Enter city"
										icon={MapPin}
									/>
									<div className="md:col-span-2">
										<CompactField
											form={form}
											name="country"
											type="select"
											label="Country"
											options={countries}
											getOptionValue={(opt) => opt.code}
											getOptionLabel={(opt) => opt.name}
											renderOption={(opt) => (
												<span>{opt.flag} {opt.name}</span>
											)}
										/>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SECTION 3: ORGANIZATION & SETTINGS */}
						<AccordionItem value="organization" className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm">
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<h2 className="text-lg font-bold text-white">Organization & Settings</h2>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
									<CompactField
										form={form}
										name="organization"
										label="Organization"
										placeholder="Enter organization"
										icon={Building2}
									/>
									<CompactField
										form={form}
										name="manager"
										label="Manager"
										placeholder="Enter manager name"
										icon={User}
									/>
									<CompactField
										form={form}
										name="timezone"
										label="Timezone"
										type="select"
										options={timezones}
										icon={Zap}
									/>
									<CompactField
										form={form}
										name="locale"
										label="Locale"
										type="select"
										options={locales}
										icon={Zap}
									/>
									<div className="md:col-span-2">
										<CompactField
											form={form}
											name="notes"
											label="Notes"
											type="textarea"
											placeholder="Add notes..."
										/>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SECTION 4: BILLING & SECURITY */}
						<AccordionItem value="billing" className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm">
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<h2 className="text-lg font-bold text-white">Billing & Security</h2>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
									<CompactField
										form={form}
										name="billingStatus"
										label="Billing Status"
										type="select"
										options={billingStatusOptions}
										icon={Shield}
									/>
									<CompactField
										form={form}
										name="twoFactorEnabled"
										label="Two-Factor Authentication"
										type="switch"
										icon={Lock}
									/>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					{/* FOOTER ACTIONS */}
					<div className="flex items-center justify-end gap-3 pt-8 px-8 pb-8 mt-6">
						<form.Submit className="px-10 h-11 rounded-xl text-white font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20">
							{isEditMode ? "Update Identity" : "Save Entity"}
						</form.Submit>
					</div>
				</form.Root>
			</div>
		</div>
	);
}