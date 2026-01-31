/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
import type {
	DeepKeys,
	DeepValue,
	FieldApi,
	FormOptions,
} from "@tanstack/react-form";
import { useForm as useTanStackForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-adapter";
import type { ComponentProps, FC, ReactNode } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AsChildProps } from "@/components/ui/slot";
import { Slot } from "@/components/ui/slot";
import { cn, createContextFactory } from "@/lib/utils";

// --- UI Interfaces ---

interface FieldLabelProps extends ComponentProps<typeof Label> { }
interface FieldDetailProps extends ComponentProps<"p">, AsChildProps { }
interface FieldMessageProps extends ComponentProps<"p">, AsChildProps { }
interface FieldContainerProps extends ComponentProps<"div"> {
	label?: string;
	detail?: string;
	message?: string;
}

type FieldUIProps<TFormData, TName extends DeepKeys<TFormData>> = {
	Label: FC<FieldLabelProps>;
	Detail: FC<FieldDetailProps>;
	Message: FC<FieldMessageProps>;
	Container: FC<FieldContainerProps>;
	Controller: {
		id: string;
		name: string;
		value: DeepValue<TFormData, TName>;
		onBlur: () => void;
		onChange: (value: DeepValue<TFormData, TName>) => void;
	};
};

// Type for the field instance stored in context
type FieldInstance = FieldApi<any, any, any, any>;

const [FieldContextProvider, useFieldContext] = createContextFactory<FieldInstance>();

// --- Main Hook ---

export function useForm<
	TFormSchema extends z.ZodType,
	TFormData = z.infer<TFormSchema>,
>(
	schema: TFormSchema,
	// Use `unknown` for the additional generic parameters to satisfy the
	// required generic arity without using `any`.
	options?: Omit<
		FormOptions<
			TFormData,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any,
			any
		>,
		"validatorAdapter"
	>,
) {
	// FIX: Pass the zodValidator instance directly. 
	// We use 'as any' here to stop the library from demanding the 12 generics 
	// on the function call itself.
	const form = useTanStackForm({
		validatorAdapter: zodValidator(schema),
		validators: {
			onChange: schema,
		},
		...options,
	} as any);

	const FormRoot = ({ className, ...props }: ComponentProps<"form">) => (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={cn("w-full space-y-6", className)}
			{...props}
		/>
	);

	const FormField = <TName extends DeepKeys<TFormData>>({
		name,
		render,
	}: {
		name: TName;
		render: (
			field: FieldApi<
				TFormData,
				TName,
				DeepValue<TFormData, TName>,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown,
				unknown
			> &
				FieldUIProps<TFormData, TName>
		) => ReactNode;
	}) => {
		return (
			<form.Field
				name={name}
				children={(field) => {
					const extendedField = Object.assign(field, {
						Label: FieldLabel,
						Detail: FieldDetail,
						Message: FieldMessage,
						Container: FieldContainer,
						Controller: {
							id: field.name.toString(),
							name: field.name.toString(),
							value: field.state.value,
							onBlur: field.handleBlur,
							onChange: (val: DeepValue<TFormData, TName>) => field.handleChange(val),
						},
					});

					return (
						<FieldContextProvider value={field}>
							{render(extendedField)}
						</FieldContextProvider>
					);
				}}
			/>
		);
	};

	const FormSubmit = ({ className, ...props }: ComponentProps<typeof Button>) => (
		<form.Subscribe
			selector={(state) => [state.canSubmit, state.isSubmitting] as const}
			children={([canSubmit, isSubmitting]) => (
				<Button
					type="submit"
					disabled={!canSubmit || isSubmitting}
					className={cn("w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px]", className)}
					{...props}
				/>
			)}
		/>
	);

	return {
		...form,
		Root: FormRoot,
		Field: FormField,
		Submit: FormSubmit,
	};
}

// --- UI Consumers ---

function useFieldInstance() {
	const field = useFieldContext();
	const state = field.useStore((s) => s);
	return { ...field, state, hasErrors: state.meta.errors.length > 0 };
}

function FieldLabel({ className, children, ...props }: FieldLabelProps) {
	const field = useFieldInstance();
	return (
		<Label
			htmlFor={field.name.toString()}
			className={cn(
				"font-bold text-[11px] uppercase tracking-wider",
				field.state.meta.isTouched && field.hasErrors && "text-destructive",
				className
			)}
			{...props}
		>
			{children}
		</Label>
	);
}

function FieldDetail({ asChild, className, children, ...props }: FieldDetailProps) {
	const Comp = asChild ? Slot : "p";
	return (
		<Comp className={cn("text-[10px] text-muted-foreground font-medium", className)} {...props}>
			{children}
		</Comp>
	);
}

function FieldMessage({ asChild, className, children, ...props }: FieldMessageProps) {
	const field = useFieldInstance();
	const Comp = asChild ? Slot : "p";
	const error = field.state.meta.isTouched && field.hasErrors ? field.state.meta.errors[0] : null;
	if (!children && !error) return null;
	return (
		<Comp
			className={cn("text-[10px] font-bold", error ? "text-destructive" : "text-muted-foreground", className)}
			{...props}
		>
			{error?.toString() || children}
		</Comp>
	);
}

function FieldContainer({ label, detail, message, children, className }: FieldContainerProps) {
	return (
		<div className={cn("space-y-1.5", className)}>
			{(label || detail) && (
				<div className="flex flex-col gap-0.5">
					{label && <FieldLabel>{label}</FieldLabel>}
					{detail && <FieldDetail>{detail}</FieldDetail>}
				</div>
			)}
			<Slot>{children}</Slot>
			<FieldMessage>{message}</FieldMessage>
		</div>
	);
}