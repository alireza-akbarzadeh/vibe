import type React from "react";
import { CompactSelect } from "@/components/table/compact-select";
import { Textarea } from "@/components/ui/forms/textarea";
import { Input } from "@/components/ui/input";
import { InputPhone } from "@/components/ui/input-phone";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Extract field name type from form's Field component
 * This correctly infers the union of all possible field names
 */
type ExtractFieldName<TForm> = TForm extends {
	// biome-ignore lint/suspicious/noExplicitAny: Inferring field names from Field component's generic props
	Field: (props: infer TProps) => any;
}
	? TProps extends { name: infer TName }
		? TName
		: string
	: string;

interface BaseCompactFieldProps<TForm> {
	form: TForm;
	name: ExtractFieldName<TForm>; // Now correctly infers "name" | "email" | "role" | etc.
	label: string;
	placeholder?: string;
	icon?: React.ElementType;
	className?: string;
}

type CompactFieldProps<TForm, TOption = string> =
	| (BaseCompactFieldProps<TForm> & {
			type?: "text" | "textarea" | "switch" | "phone";
			options?: never;
			getOptionValue?: never;
			getOptionLabel?: never;
			renderOption?: never;
	  })
	| (BaseCompactFieldProps<TForm> & {
			type: "select";
			options: readonly TOption[];
			getOptionValue?: (option: TOption) => string;
			getOptionLabel?: (option: TOption) => string;
			renderOption?: (option: TOption) => React.ReactNode;
	  });

// biome-ignore lint/suspicious/noExplicitAny: Form can have any Field component structure
export function CompactField<TForm extends { Field: any }, TOption = string>(
	props: CompactFieldProps<TForm, TOption>,
) {
	const { form, name, placeholder, icon: Icon, type = "text" } = props;

	return (
		// biome-ignore lint/suspicious/noExplicitAny: Field accepts additional props we don't control
		<form.Field name={name as any}>
			{/* biome-ignore lint/suspicious/noExplicitAny: Field type is inferred from TanStack Form */}
			{(field: any) => {
				const baseStyles = cn(
					"bg-white/[0.03] border-white/10 rounded-xl text-white text-sm transition-all focus:border-blue-500/50 focus-visible:ring-0 focus:ring-0",
					Icon ? "pl-12" : "pl-4",
				);

				const value = field.state.value;

				switch (type) {
					case "select": {
						return (
							<CompactSelect<TForm, TOption>
								props={props}
								field={field}
								baseStyles={baseStyles}
								placeholder={placeholder}
								Icon={Icon}
							/>
						);
					}
					case "textarea":
						return (
							<Textarea
								value={(value as string) ?? ""}
								onChange={(e) => field.handleChange(e.target.value)}
								className={cn(baseStyles, "min-h-25 py-3")}
								placeholder={placeholder}
							/>
						);

					case "switch":
						return (
							<div className="flex items-center justify-between h-11 px-4 bg-white/2 border border-white/5 rounded-xl">
								<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
									{placeholder || "Enabled"}
								</span>
								<Switch
									checked={!!value}
									onCheckedChange={(val) => field.handleChange(val)}
								/>
							</div>
						);

					case "phone":
						return (
							<div
								className={cn(
									baseStyles,
									"h-11 overflow-hidden flex items-center p-0",
								)}
							>
								<InputPhone
									value={(value as string) ?? ""}
									onChange={(val) => field.handleChange(val)}
									className="border-none bg-transparent h-full w-full "
								/>
							</div>
						);

					default:
						return (
							<Input
								value={(value as string) ?? ""}
								onChange={(e) => field.handleChange(e.target.value)}
								className={cn(baseStyles, "h-11")}
								placeholder={placeholder}
							/>
						);
				}
			}}
		</form.Field>
	);
}
