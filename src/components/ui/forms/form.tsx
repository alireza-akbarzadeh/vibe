/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */

import type {
	DeepKeys,
	FieldApi,
	FormOptions,
} from "@tanstack/react-form";
import { useField, useForm as useTanStackForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-adapter";
import type { ComponentProps, ReactNode } from "react";
import React from "react";
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

// --- Context ---

type FieldContextValue = {
	form: any;
	name: string;
};

const [FieldContextProvider, useFieldContext] = createContextFactory<FieldContextValue>();

// --- Main Hook ---

export function useForm<
	TFormSchema extends z.ZodType,
	TFormData = z.infer<TFormSchema>,
>(
	schema: TFormSchema,
	options?: Omit<
		FormOptions<TFormData, any, any, any, any, any, any, any, any, any, any, any>,
		"validatorAdapter"
	>,
) {
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

	/**
	 * Dynamic Field Wrapper
	 * Handles Icon positioning, Label/Detail layout, and provides the FieldApi to children.
	 */
	const FormField = <TName extends DeepKeys<TFormData>>({
		name,
		label,
		detail,
		icon: Icon,
		className,
		children,
	}: {
		name: TName;
		label?: string;
		detail?: string;
		icon?: React.ElementType;
		className?: string;
		children: (field: FieldApi<TFormData, TName, any, any, any>) => ReactNode;
	}) => {
		const field = useField({ form, name: name as any });

		return (
			<FieldContextProvider value={{ form, name: name as string }}>
				<FieldContainer label={label} detail={detail} className={cn("group", className)}>
					<div className="relative flex items-center">
						{Icon && (
							<div className="absolute left-4 z-10 opacity-20 group-focus-within:opacity-70 transition-opacity pointer-events-none">
								<Icon className="w-4 h-4 text-white" />
							</div>
						)}
						<div className="flex-1">
							{children(field as any)}
						</div>
					</div>
				</FieldContainer>
			</FieldContextProvider>
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
	const context = useFieldContext();
	const field = useField({
		form: context.form,
		name: context.name,
	});

	const state = field.state;
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

	const rawError = field.state.meta.isTouched && field.hasErrors
		? field.state.meta.errors[0]
		: null;

	const errorMessage = React.useMemo(() => {
		if (!rawError) return null;
		if (typeof rawError === 'string') return rawError;
		if (typeof rawError === 'object' && 'message' in (rawError as any)) {
			return (rawError as any).message;
		}
		return String(rawError);
	}, [rawError]);

	if (!children && !errorMessage) return null;

	return (
		<Comp
			className={cn(
				"text-[10px] font-bold",
				errorMessage ? "text-destructive" : "text-muted-foreground",
				className
			)}
			{...props}
		>
			{errorMessage || children}
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